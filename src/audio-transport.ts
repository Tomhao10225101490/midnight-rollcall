/** AudioContext transitions are asynchronous; never race resume against suspend. */
export class AudioTransport {
 private wanted = false;
 private pending: Promise<void> = Promise.resolve();
 constructor(private readonly context: Pick<AudioContext,'state'|'resume'|'suspend'>) {}
 setRunning(wanted: boolean) {
  this.wanted = wanted;
  this.pending = this.pending.then(async () => {
   if (this.context.state === 'closed') return;
   if (this.wanted) await this.context.resume();
   else await this.context.suspend();
  }).catch(() => { /* A rejected device/autoplay request can be retried by the next user action. */ });
  return this.pending;
 }
}
