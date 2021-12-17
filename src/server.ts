// Library
import { App, Logger } from './library';

// Config
import { dbConfig } from './config/database';
import { swaggerConfig } from './config/swagger';

// Endpoints
import { UserController } from './modules/users/v1';
import { AuthController } from './modules/auth/v1';
import { ActivityController } from './modules/activity/v1';
import { ListController } from './modules/list/v1';
import { MemberController } from './modules/member/v1';
import { RelationController } from './modules/relation/v1';
import { HistoricController } from './modules/historic/v1';

const app: App = new App({
    port: Number(process.env.PORT || 8080),
    controllers: [UserController, ActivityController, ListController, MemberController, AuthController, RelationController, HistoricController],
    middlewares: [Logger.middleware],
    logger: new Logger(),
    swaggerOptions: process.env.NODE_ENV === 'development' ? swaggerConfig : undefined,
    dbConfig
});

app.start();
