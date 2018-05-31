import * as moment from 'moment'

export enum LogLevel {
  DEBUG,
  INFO,
  WARNING,
  DANGER,
}

export class LogMessage {
  constructor(
    public level: LogLevel,
    public message: string,
  ) {
  }
}

export class Logger {
  public messages: LogMessage[] = []

  public debug(message: string): void {
    this.addMessage(LogLevel.DEBUG, message)
  }

  public info(message: string): void {
    this.addMessage(LogLevel.INFO, message)
  }

  public warning(message: string): void {
    this.addMessage(LogLevel.WARNING, message)
  }

  public danger(message: string): void {
    this.addMessage(LogLevel.DANGER, message)
  }

  private addMessage(level: LogLevel, message: string): void {
    this.messages.push(
      new LogMessage(
        level,
        message
      )
    )
  }
}
