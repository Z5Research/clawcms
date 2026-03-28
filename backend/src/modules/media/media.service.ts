import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media } from '../../entities/media.entity';
import { User } from '../../entities/user.entity';

interface FindMediaOptions {
  page: number;
  limit: number;
  type?: string;
  folder?: string;
}

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {}

  async upload(
    file: Express.Multer.File,
    body: { folder?: string; alt?: string; description?: string },
    user: any,
  ): Promise<Media> {
    if (!file) {
      throw new BadRequestException('未上传文件');
    }

    // 确定文件类型
    const fileType = this.getFileType(file.mimetype);

    // 生成 URL（实际应上传到 S3/OSS）
    const url = `/uploads/${file.filename}`;
    const thumbnailUrl = fileType === 'image' ? `/uploads/thumbnails/${file.filename}` : null;

    // 智能体上传时，uploaderId 为 null（避免外键约束）
    const uploaderId = user.type === 'agent' ? null : user.id;

    const media = this.mediaRepository.create({
      filename: file.filename,
      originalFilename: file.originalname,
      url,
      thumbnailUrl,
      fileType,
      mimeType: file.mimetype,
      fileSize: file.size,
      altText: body.alt,
      description: body.description,
      folderPath: body.folder || 'uploads',
      uploaderId,
      isPublic: true,
    });

    return this.mediaRepository.save(media);
  }

  async findAll(options: FindMediaOptions) {
    const { page, limit, type, folder } = options;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (type) where.fileType = type;
    if (folder) where.folderPath = folder;

    const [media, total] = await this.mediaRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: media,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Media> {
    const media = await this.mediaRepository.findOne({
      where: { id },
      relations: ['uploader'],
    });

    if (!media) {
      throw new NotFoundException(`媒体文件 ${id} 不存在`);
    }

    return media;
  }

  async remove(id: string): Promise<void> {
    const result = await this.mediaRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`媒体文件 ${id} 不存在`);
    }
    // 实际应同步删除 S3/OSS 文件
  }

  async updateFolder(id: string, folderPath: string): Promise<Media> {
    const media = await this.findOne(id);
    media.folderPath = folderPath;
    return this.mediaRepository.save(media);
  }

  private getFileType(mimetype: string): string {
    if (mimetype.startsWith('image/')) return 'image';
    if (mimetype.startsWith('video/')) return 'video';
    if (mimetype.startsWith('audio/')) return 'audio';
    return 'document';
  }
}
