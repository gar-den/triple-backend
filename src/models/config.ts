const config = {
  host: process.env.DB_HOST || 'localhost',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'test',
  db: process.env.DB_NAME || 'triple',
  pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
  }
};

export default config;