import { ConfigService } from '@nestjs/config';
import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';
import * as dns from 'dns';

// DNS fix (development only recommended)
if (process.env.NODE_ENV !== 'production') {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
    console.log('[MongoDB] Using custom DNS:', dns.getServers());
}

export const databaseProvider: MongooseModuleAsyncOptions = {
    useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        connectionFactory: (connection) => {
            if (connection.readyState === 1) {
                console.log('✅ MongoDB connected successfully');
            }
            connection.on('connected', () => {
                console.log('✅ MongoDB connected successfully');
            });
            connection.on('error', (err) => {
                console.error('❌ MongoDB connection error:', err);
            });
            return connection;
        },
    }),
    inject: [ConfigService],
};
