
import { setupServer } from './server.js';

import {initMongoConnection } from "./db/initMongoConnection.js";

const bootstrap = async () => {
  await initMongoConnection();
  setupServer();
};

bootstrap();




// g3eQce8TRTb8TUof
// mongodb+srv://Kateryna0502:Nasta2009@mycluster.tytx1.mongodb.net/
