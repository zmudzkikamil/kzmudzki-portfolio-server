import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { MoreThan, Repository } from 'typeorm';
import { Resend } from 'resend';
import { ContactSubmission } from './contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);
  private readonly resend: Resend;
  private readonly recipientEmail: string;

  constructor(
    @InjectRepository(ContactSubmission)
    private readonly repo: Repository<ContactSubmission>,
    private readonly configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    this.resend = new Resend(apiKey);
    this.recipientEmail = this.configService.get<string>('RECIPIENT_EMAIL');
  }

  async submit(dto: CreateContactDto, ip: string): Promise<{ success: true }> {
    await this.checkRateLimit(ip);

    const name = this.stripHtml(dto.name);
    const message = this.stripHtml(dto.message);

    const submission = this.repo.create({
      name,
      email: dto.email,
      message,
      ip_address: ip,
      status: 'pending',
    });
    await this.repo.save(submission);

    try {
      const { error } = await this.resend.emails.send({
        from: 'onboarding@resend.dev',
        to: this.recipientEmail,
        replyTo: dto.email,
        subject: `Portfolio Contact: ${name}`,
        html: this.buildEmailHtml(
          name,
          dto.email,
          message,
          submission.submitted_at,
          ip,
        ),
      });

      if (error) {
        throw new Error(error.message);
      }

      submission.status = 'sent';
      await this.repo.save(submission);
      return { success: true };
    } catch (err) {
      this.logger.error('Failed to send contact email', err);
      submission.status = 'failed';
      await this.repo.save(submission);
      throw new InternalServerErrorException(
        'Your message was received but could not be delivered. Please try again later.',
      );
    }
  }

  private async checkRateLimit(ip: string): Promise<void> {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentCount = await this.repo.count({
      where: { ip_address: ip, submitted_at: MoreThan(oneHourAgo) },
    });
    if (recentCount >= 5) {
      throw new HttpException(
        'Too many requests. Please try again later.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }

  private stripHtml(str: string): string {
    return str.replace(/<[^>]*>/g, '');
  }

  private escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  private buildEmailHtml(
    name: string,
    email: string,
    message: string,
    timestamp: Date,
    ip: string,
  ): string {
    const safeName = this.escapeHtml(name);
    const safeEmail = this.escapeHtml(email);
    const safeMessage = this.escapeHtml(message).replace(/\n/g, '<br>');

    return `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Portfolio Contact Form Submission</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #555; width: 120px;">Name</td>
            <td style="padding: 8px;">${safeName}</td>
          </tr>
          <tr style="background: #f9f9f9;">
            <td style="padding: 8px; font-weight: bold; color: #555;">Email</td>
            <td style="padding: 8px;"><a href="mailto:${safeEmail}">${safeEmail}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #555;">Timestamp</td>
            <td style="padding: 8px;">${timestamp.toISOString()}</td>
          </tr>
          <tr style="background: #f9f9f9;">
            <td style="padding: 8px; font-weight: bold; color: #555;">IP Address</td>
            <td style="padding: 8px;">${ip}</td>
          </tr>
        </table>
        <h3 style="color: #333; margin-top: 24px;">Message</h3>
        <div style="background: #f9f9f9; padding: 16px; border-radius: 4px; line-height: 1.6;">
          ${safeMessage}
        </div>
        <p style="color: #999; font-size: 12px; margin-top: 24px;">
          Reply to this email to respond directly to ${safeName}.
        </p>
      </div>
    `;
  }
}
