export type VoiceStyle='pa'|'proctor'|'whisper';
export type VoiceId=
 'open' | 'resume-1' | 'resume-2' | 'resume-3' | 'resume-4' | 'name' | 'unlisted' | 'dawn' | 'bell' | 'victory' | 'after-exam' | 'after-archive' | 'after-radio' | 'after-pass' | 'read-record' | 'capture' | 'chase' | 'halt' | 'search-hide' | 'empty-class';
export const voiceLines:{readonly [id in VoiceId]:{file:string;style:VoiceStyle;text:string;aliases:readonly string[]}}={
 "open":{file:"open.wav",style:"pa",text:"林序同学，晚自习结束。请安静行走。请到一班检查遗留试卷。",aliases:[]},
 "resume-1":{file:"resume-1.wav",style:"pa",text:"检查点已恢复。当前任务：打开办公室档案柜。按J查看已经收集的记录。",aliases:[]},
 "resume-2":{file:"resume-2.wav",style:"pa",text:"检查点已恢复。当前任务：校准广播频率。按J查看已经收集的记录。",aliases:[]},
 "resume-3":{file:"resume-3.wav",style:"pa",text:"检查点已恢复。当前任务：修复侧门配电并领取通行证。按J查看已经收集的记录。",aliases:[]},
 "resume-4":{file:"resume-4.wav",style:"pa",text:"检查点已恢复。当前任务：趁铃声离开出口。按J查看已经收集的记录。",aliases:[]},
 "name":{file:"name.wav",style:"pa",text:"林序。林序。应到一人，实到零人。请不要替空座位上的人应答。",aliases:["广播：林序。林序。应到一人，实到零人。请不要替空座位上的人应答。"]},
 "unlisted":{file:"unlisted.wav",style:"pa",text:"名单接收失败……名单接收成功。林序，这次请按你自己的名字离校。",aliases:["广播：名单接收失败……名单接收成功。林序，这次请按你自己的名字离校。"]},
 "dawn":{file:"dawn.wav",style:"pa",text:"最后一位同学，请保留走廊照明。有人还需要看见回去的路。",aliases:["广播：最后一位同学，请保留走廊照明。有人还需要看见回去的路。"]},
 "bell":{file:"bell.wav",style:"pa",text:"铃声期间，侧门开放十二秒。值班人员原地听令。请保持距离。",aliases:[]},
 "victory":{file:"victory.wav",style:"pa",text:"本次点名结束。你的名字，已从名单中划去。",aliases:[]},
 "after-exam":{file:"after-exam.wav",style:"pa",text:"试卷已登记。请核对二班记录，再前往办公室。",aliases:[]},
 "after-archive":{file:"after-archive.wav",style:"pa",text:"档案已核验。请前往纪律室核对频道，再到广播室发送空白名单。",aliases:[]},
 "after-radio":{file:"after-radio.wav",style:"pa",text:"空白名单已接收。请到配电值班室领取侧门通行证。",aliases:[]},
 "after-pass":{file:"after-pass.wav",style:"pa",text:"通行证已签发。等铃声响起，从东侧出口离校。",aliases:[]},
 "read-record":{file:"read-record.wav",style:"pa",text:"请阅读这份校园记录。",aliases:[]},
 "capture":{file:"capture.wav",style:"proctor",text:"林序，你的名字还在名单上。请回到座位。",aliases:[]},
 "chase":{file:"chase.wav",style:"proctor",text:"林序，不要在走廊奔跑。",aliases:[]},
 "halt":{file:"halt.wav",style:"proctor",text:"站住。晚自习还没有结束。",aliases:[]},
 "search-hide":{file:"search-hide.wav",style:"proctor",text:"储物柜也要检查。不要以为躲起来就可以离校。",aliases:[]},
 "empty-class":{file:"empty-class.wav",style:"whisper",text:"有人吗？教室里，怎么没人应？",aliases:["隔壁传来三声轻敲。教室里没有应答，门也没有打开。"]},
};
const lookup=new Map<string,VoiceId>();
for(const id of Object.keys(voiceLines) as VoiceId[]){
 const line=voiceLines[id];lookup.set(line.text,id);for(const alias of line.aliases)lookup.set(alias,id);
}
export function matchVoice(text:string):VoiceId|undefined{return lookup.get(text)}
