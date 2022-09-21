import { PrismaClient } from '@prisma/client';
import express from 'express';
import cors from 'cors';
import convertHoursStringToMinutes from 'utils/convertHoursStringToMinutes';
import convertMinutesStringToHours from 'utils/convertMinutesStringToHours';

const app = express();
app.use(express.json());
app.use(cors());

const prisma = new PrismaClient();

app.get('/games', async (req, res) => {
  const games = await prisma.game.findMany({
    include: {
      _count: {
        select: {
          ads: true,
        },
      },
    },
  });

  return res.json(games);
});

app.post('/ads', (req, res) => {
  return res.json([]);
});

app.post('/games/:id/ads', async (req, res) => {
  const gameId = req.params.id;
  const { body } = req;
  delete body.game;

  const ad = await prisma.ad.create({
    data: {
      ...body,
      gameId,
      weekDays: body.weekDays.join(','),
      hourStart: convertHoursStringToMinutes(body.hourStart),
      hourEnd: convertHoursStringToMinutes(body.hourEnd),
    },
  });

  return res.status(201).json(ad);
});

app.get('/games/:id/ads', async (req, res) => {
  const gameId = req.params.id as string;

  const ads = await prisma.ad.findMany({
    select: {
      id: true,
      name: true,
      weekDays: true,
      useVoiceChannel: true,
      yearsPlaying: true,
      hourStart: true,
      hourEnd: true,
    },
    where: {
      gameId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return res.json(
    ads.map((ad: any) => {
      return {
        ...ad,
        weekDays: ad.weekDays.split(','),
        hourStart: convertMinutesStringToHours(ad.hourStart),
        hourEnd: convertMinutesStringToHours(ad.hourEnd),
      };
    }),
  );
});

app.get('/ads/:id/discord', async (req, res) => {
  const adId = req.params.id;

  const ad = await prisma.ad.findUniqueOrThrow({
    select: {
      discord: true,
    },
    where: {
      id: adId,
    },
  });
  return res.json({
    discord: ad.discord,
  });
});

app.listen(3333);
