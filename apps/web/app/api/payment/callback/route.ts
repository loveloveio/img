import { NextResponse } from 'next/server'
import winston from 'winston'
import 'winston-daily-rotate-file'

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.DailyRotateFile({
      filename: 'logs/payment-callback-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d'
    })
  ]
})


export const GET = handleRequest
export const POST = handleRequest

async function handleRequest(request: Request) {
  const data = await request.json().catch(() => null)
  
  logger.info('Payment callback received', {
    method: request.method,
    data,
    headers: Object.fromEntries(request.headers)
  })

  return new NextResponse('success')
}