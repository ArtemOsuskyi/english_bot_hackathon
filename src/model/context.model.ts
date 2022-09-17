import { Context } from "telegraf";

export interface SessionData {
  type?: 'day' | 'time' | null
}

export interface BotContext extends Context {
  session?: SessionData
}
