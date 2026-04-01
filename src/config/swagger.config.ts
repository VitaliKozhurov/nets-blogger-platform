import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setupSwaggerConfig = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Blogger Platform')
    .setDescription('Blogger Platform API description')
    .setVersion('1.0')
    .addBasicAuth(
      {
        type: 'http',
        scheme: 'basic',
        description: 'Enter the administrator login and password',
      },
      'basicAuth'
    )
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, documentFactory);
};
