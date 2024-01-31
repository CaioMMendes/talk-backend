export const corsOptions = {
  origin: [
    process.env.FRONTEND_URL_1,
    process.env.FRONTEND_URL_2,
    process.env.FRONTEND_URL_3,
    process.env.FRONTEND_URL_4,
  ],
  optionsSucessStatus: 200,
  credentials: true,
};
