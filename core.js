(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.Foley = api;
})(typeof globalThis === "object" ? globalThis : this, function () {
  "use strict";
  const RATE = 24000,
    MAX_CLIPS = 64,
    MAX_DURATION = 20;
  const groups = [
    [
      "wood",
      "木质",
      ["木块轻敲", "空心木箱", "竹片连击", "键帽跳动", "木地板脚步"],
    ],
    [
      "metal",
      "金属",
      ["铁片轻碰", "硬币旋转", "小铜铃", "链条晃动", "铁门扣响"],
    ],
    [
      "water",
      "液体",
      ["一滴清水", "气泡上浮", "细雨颗粒", "短促水花", "水面涟漪"],
    ],
    ["air", "气流", ["短促气流", "穿堂风", "软刷拂过", "扫动噪声", "缓慢呼气"]],
    [
      "electric",
      "电子",
      ["信号短音", "下降激光", "上升啁啾", "电流蜂鸣", "机器人答复"],
    ],
    [
      "paper",
      "摩擦",
      ["脆纸轻点", "撕纸纹理", "纸袋沙响", "拉链纹理", "折纸折痕"],
    ],
    [
      "low",
      "低频",
      ["低鼓闷击", "双脉冲心跳", "远处低鸣", "弹性低音", "弹簧回摆"],
    ],
    [
      "bright",
      "亮音",
      ["短弦拨动", "软糖爆破", "细小滴答", "玻璃风铃", "闪光颗粒"],
    ],
  ];
  const sounds = groups.flatMap(([category, label, names], g) =>
    names.map((name, v) => ({
      id: `s${g * 5 + v}`,
      name,
      category,
      label,
      variant: v,
      group: g,
      duration: 1.6,
      origin: "程序合成 / 原创",
    })),
  );
  const pairs = [
    [
      "一声，两种入口",
      "木门合上",
      "巨书翻页",
      "同一个短促敲击，画面会把它变成门闩，或厚书的书脊。",
      "wood",
    ],
    [
      "弹跳还是水滴",
      "橡胶球落地",
      "水滴落入池塘",
      "先盲听，再切换画面：弹性尾音可能属于球，也可能属于水。",
      "water",
    ],
    [
      "赶路的字母",
      "打字机敲字",
      "小火车越过接缝",
      "同样的短点会被解释成手指工作，或车轮前进。",
      "wood",
    ],
    [
      "有生命的信号",
      "心脏脉动",
      "灯塔闪烁",
      "低脉冲既可能让你想到身体，也可能只是机械信号。",
      "low",
    ],
    [
      "小颗粒暴雨",
      "雨点敲窗",
      "爆米花开花",
      "颗粒声的解释来自你看到的东西；试试更干脆和更柔和的版本。",
      "bright",
    ],
    [
      "谁在振动",
      "齿轮咬合",
      "昆虫振翅",
      "一串有规律的摩擦，能听成机械，也能听成活物。",
      "paper",
    ],
    [
      "落下的光",
      "硬币落罐",
      "星星点亮",
      "明亮金属尾音可以属于真实碰撞，也可以配给抽象的光。",
      "metal",
    ],
    [
      "一口长气",
      "窗帘吹动",
      "海浪推进",
      "长噪声几乎没有物体身份，画面为它补上来源。",
      "air",
    ],
    [
      "纸与羽毛",
      "纸飞机掠过",
      "小鸟掠过",
      "同样轻短的拂动声，给纸和羽毛各写一个版本。",
      "air",
    ],
    [
      "看不见的力",
      "磁铁吸住铁块",
      "激光命中靶心",
      "电子滑音没有真实物理来源，却能让两个动作都显得可信。",
      "electric",
    ],
    [
      "冷与热",
      "冰面开裂",
      "小火苗跳动",
      "细碎爆裂声常跨越不同材料；观察颜色怎样影响你的判断。",
      "paper",
    ],
    [
      "一条摩擦带",
      "拉链拉合",
      "小锯切木",
      "连贯的颗粒声换一种节奏，就换了一种工具。",
      "paper",
    ],
    [
      "反弹的回声",
      "乒乓球对打",
      "雷达扫描目标",
      "重复短音会让运动和仪器读数共享一种节奏。",
      "electric",
    ],
    [
      "时间在走路",
      "挂钟走针",
      "鞋子踏地",
      "同一组滴答，既能标时间，也能标空间。",
      "wood",
    ],
    [
      "圆形的引力",
      "泡泡破裂",
      "行星碰撞",
      "微小事件和巨大事件可以共享素材；速度会改变想象的尺度。",
      "water",
    ],
    [
      "大块头经过",
      "吊桥震动",
      "恐龙踏步",
      "低音可以把简单图形变得沉重；音色只是暗示，不是测量。",
      "low",
    ],
    [
      "旋转的天气",
      "洗衣机旋转",
      "雪花旋舞",
      "循环的沙声可以来自家电，也能成为想象中的天气。",
      "air",
    ],
    [
      "有人在回答",
      "潜艇声呐",
      "机器人眨眼",
      "提示音让无生命物体像是在与你交流。",
      "electric",
    ],
    [
      "老电影奔跑",
      "胶片放映机",
      "小马奔跑",
      "连续的脆响像机器齿轮，也像交替的蹄子。",
      "wood",
    ],
    [
      "最后三秒",
      "火箭准备发射",
      "厨房倒计时",
      "最后一次混合：亮音、脉冲和气流，共用一条音轨讲两个故事。",
      "bright",
    ],
  ];
  const levels = pairs.map((p, i) => {
    const times =
      i < 2
        ? [1.5, 3.5]
        : i < 6
          ? [1, 2, 3, 4]
          : i === 19
            ? [1, 2, 3, 4.5]
            : [1, 2.5, 4];
    const events = times.map((time, j) => ({
      time,
      categories:
        i === 19
          ? j === 3
            ? ["air"]
            : ["bright", "electric"]
          : [
              p[4],
              ...(p[4] === "wood"
                ? ["paper"]
                : p[4] === "water"
                  ? ["bright"]
                  : []),
            ],
      tolerance: 0.22,
    }));
    return {
      id: `lab-${i + 1}`,
      index: i,
      title: p[0],
      left: p[1],
      right: p[2],
      insight: p[3],
      duration: 6,
      events,
      rule:
        i === 5
          ? { type: "repeat", min: 3 }
          : i === 9
            ? { type: "speed", min: 1.4 }
            : i === 14
              ? { type: "trim", min: 0.1 }
              : null,
    };
  });
  const byId = (id) => sounds.find((s) => s.id === id);
  const finite = (v) => typeof v === "number" && Number.isFinite(v);
  function synth(sound, rate = RATE) {
    const n = Math.ceil(sound.duration * rate),
      out = new Float32Array(n),
      g = sound.group,
      v = sound.variant;
    let seed = 7919 * (g + 1) + v * 173;
    for (let i = 0; i < n; i++) {
      const t = i / rate;
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const noise = seed / 2147483648 - 1,
        attack = Math.min(1, t / 0.004),
        d = 0.12 + v * 0.075;
      let x = 0;
      if (g === 0)
        x =
          (Math.sin(2 * Math.PI * (180 + v * 67) * t) +
            0.45 * Math.sin(2 * Math.PI * (487 + v * 83) * t) +
            0.45 * noise) *
          Math.exp(-t / d);
      if (g === 1)
        x =
          (Math.sin(2 * Math.PI * (590 + v * 107) * t) +
            0.6 * Math.sin(2 * Math.PI * (917 + v * 139) * t) +
            0.3 * Math.sin(2 * Math.PI * (1461 + v * 117) * t)) *
          Math.exp(-t / (0.3 + v * 0.13));
      if (g === 2)
        x =
          Math.sin(
            2 *
              Math.PI *
              ((420 + v * 60) * t +
                (850 - v * 50) * 0.026 * (1 - Math.exp(-t / 0.026))),
          ) *
            Math.exp(-t / (0.16 + v * 0.045)) +
          0.1 * noise * Math.exp(-t / 0.06);
      if (g === 3)
        x =
          noise *
          (0.25 + 0.2 * Math.sin(t * (16 + v * 3))) *
          Math.sin(Math.PI * Math.min(t / (0.7 + v * 0.16), 1)) *
          Math.exp(-t / 0.9);
      if (g === 4)
        x =
          (Math.sin(
            2 * Math.PI * ((440 + v * 130) * t + (v % 2 ? -220 : 330) * t * t),
          ) +
            0.2 * Math.sin(2 * Math.PI * 1320 * t)) *
          Math.exp(-t / (0.22 + v * 0.12));
      if (g === 5)
        x =
          noise *
          (0.35 +
            0.65 *
              Math.pow(
                Math.max(0, Math.sin(2 * Math.PI * (18 + v * 13) * t)),
                4,
              )) *
          Math.exp(-t / (0.2 + v * 0.16));
      if (g === 6)
        x =
          Math.sin(
            2 *
              Math.PI *
              ((62 + v * 11) * t + 8 * 0.06 * (1 - Math.exp(-t / 0.06))),
          ) *
            Math.exp(-t / (0.2 + v * 0.16)) +
          0.15 * noise * Math.exp(-t / 0.025);
      if (g === 7)
        x =
          (Math.sin(2 * Math.PI * (1000 + v * 240) * t) +
            0.25 * Math.sin(2 * Math.PI * (1701 + v * 360) * t)) *
          Math.exp(-t / (0.07 + v * 0.08));
      if (v === 2 && (g === 0 || g === 1 || g === 5))
        x *= 0.55 + 0.45 * Math.cos(2 * Math.PI * 11 * t);
      if (g === 6 && v === 1 && t > 0.18)
        x +=
          0.65 *
          Math.sin(2 * Math.PI * 70 * (t - 0.18)) *
          Math.exp(-(t - 0.18) / 0.1);
      out[i] =
        Math.max(-1, Math.min(1, x * 0.42 * attack)) *
        Math.min(1, (n - i) / (rate * 0.015));
    }
    return out;
  }
  function defaultClip(soundId, time = 0, lane = 0) {
    return {
      id: `clip-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      soundId,
      start: time,
      trimStart: 0,
      trimEnd: 0.5,
      speed: 1,
      repeats: 1,
      gap: 1,
      gain: 0.65,
      lane,
    };
  }
  function validateProject(raw) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw))
      throw Error("文件不是作品对象");
    if (raw.format !== "foley-illusion-lab" || raw.version !== 1)
      throw Error("不支持的挑战包格式或版本");
    if (
      !finite(raw.duration) ||
      raw.duration < 2 ||
      raw.duration > MAX_DURATION
    )
      throw Error("作品长度必须为 2–20 秒");
    if (!Array.isArray(raw.clips) || raw.clips.length > MAX_CLIPS)
      throw Error("最多允许 64 个声音片段");
    if (!Array.isArray(raw.custom)) throw Error("自带音色列表损坏");
    const custom = raw.custom;
    if (custom.length > 4) throw Error("最多允许 4 个自带音色");
    const customIds = new Set();
    const checkedCustom = custom.map((s) => {
      if (
        !s ||
        typeof s.id !== "string" ||
        !/^u-[a-z0-9-]{1,60}$/i.test(s.id) ||
        customIds.has(s.id)
      )
        throw Error("自带音色编号不合法");
      if (
        typeof s.pcm !== "string" ||
        s.pcm.length > 640000 ||
        s.pcm.length < 4 ||
        s.pcm.length % 4 ||
        !/^[A-Za-z0-9+/]*={0,2}$/.test(s.pcm)
      )
        throw Error("音频数据损坏或超过 10 秒");
      const bytes =
        (s.pcm.length / 4) * 3 -
        (s.pcm.endsWith("==") ? 2 : s.pcm.endsWith("=") ? 1 : 0);
      if (bytes % 2 || bytes / 2 > RATE * 10) throw Error("音频采样长度不合法");
      customIds.add(s.id);
      return {
        id: s.id,
        name: String(s.name || "导入声音").slice(0, 40),
        pcm: s.pcm,
        duration: bytes / 2 / RATE,
        category: "custom",
        origin: "用户导入",
      };
    });
    const usedIds = new Set();
    const clips = raw.clips.map((c, i) => {
      if (
        !c ||
        typeof c !== "object" ||
        (!byId(c.soundId) && !customIds.has(c.soundId))
      )
        throw Error(`片段 ${i + 1} 引用了不存在的音色`);
      const limits = {
        start: [0, raw.duration],
        trimStart: [0, 10],
        trimEnd: [0.01, 10],
        speed: [0.5, 2],
        repeats: [1, 8],
        gap: [0.15, 4],
        gain: [0, 1],
        lane: [0, 2],
      };
      for (const [k, [min, max]] of Object.entries(limits))
        if (!finite(c[k]) || c[k] < min || c[k] > max)
          throw Error(`片段 ${i + 1} 的 ${k} 超出范围`);
      if (c.start >= raw.duration) throw Error("片段起点必须位于作品时长以内");
      if (!Number.isInteger(c.repeats) || !Number.isInteger(c.lane))
        throw Error("重复次数和音轨必须为整数");
      const source =
        byId(c.soundId) || checkedCustom.find((s) => s.id === c.soundId);
      if (
        c.trimEnd > source.duration + 0.00001 ||
        c.trimEnd - c.trimStart < 0.01
      )
        throw Error("裁剪范围超出音源或短于 0.01 秒");
      const id =
        typeof c.id === "string" && /^[a-z0-9-]{1,80}$/i.test(c.id)
          ? c.id
          : `clip-import-${i}`;
      if (usedIds.has(id)) throw Error("片段编号重复");
      usedIds.add(id);
      return {
        id,
        soundId: c.soundId,
        ...Object.fromEntries(Object.keys(limits).map((k) => [k, c[k]])),
      };
    });
    if (!Number.isInteger(raw.scene) || raw.scene < 0 || raw.scene >= 20)
      throw Error("画面编号超出范围");
    const scene = raw.scene;
    if (raw.levelId !== null && !levels.some((l) => l.id === raw.levelId))
      throw Error("未知挑战关卡编号");
    const levelId = raw.levelId;
    if (levelId && (levels[scene].id !== levelId || raw.duration !== 6))
      throw Error("挑战关卡编号、画面或时长不一致");
    return {
      format: "foley-illusion-lab",
      version: 1,
      title: String(raw.title || "未命名实验").slice(0, 80),
      duration: raw.duration,
      scene,
      levelId,
      clips,
      custom: checkedCustom,
      note: String(raw.note || "").slice(0, 1200),
    };
  }
  function emptyProject(scene = 0) {
    return {
      format: "foley-illusion-lab",
      version: 1,
      title: levels[scene].title,
      duration: 6,
      scene,
      levelId: levels[scene].id,
      clips: [],
      custom: [],
      note: "",
    };
  }
  function expanded(clips, duration) {
    return clips
      .flatMap((c) =>
        Array.from({ length: c.repeats }, (_, k) => ({
          ...c,
          onset: c.start + k * c.gap,
          length: (c.trimEnd - c.trimStart) / c.speed,
        })),
      )
      .filter((c) => c.onset < duration);
  }
  function evaluate(project, level) {
    const events = expanded(project.clips, project.duration).filter(
        (c) => c.gain >= 0.1 && c.length >= 0.06,
      ),
      used = new Set();
    const checks = level.events.map((e) => {
      const ix = events.findIndex(
        (c, j) =>
          !used.has(j) &&
          Math.abs(c.onset - e.time) <= e.tolerance &&
          e.categories.includes(byId(c.soundId)?.category),
      );
      if (ix >= 0) used.add(ix);
      return {
        label: `${e.time.toFixed(2)} 秒 · ${e.categories.map((k) => groups.find((g) => g[0] === k)?.[1]).join(" / ")} · ±${e.tolerance.toFixed(2)} 秒`,
        ok: ix >= 0,
      };
    });
    if (level.rule) {
      const r = level.rule;
      const eligible = events.filter((c, i) => used.has(i));
      checks.push({
        label:
          r.type === "repeat"
            ? `至少一个命中的片段重复 ${r.min} 次`
            : r.type === "speed"
              ? `至少一个命中的片段速度 ≥ ${r.min}×`
              : `至少一个命中的片段从音源 ${r.min} 秒之后裁入`,
        ok: eligible.some((c) =>
          r.type === "repeat"
            ? c.repeats >= r.min
            : r.type === "speed"
              ? c.speed >= r.min
              : c.trimStart >= r.min,
        ),
      });
    }
    return {
      passed: checks.every((c) => c.ok),
      score: Math.round(
        (checks.filter((c) => c.ok).length / checks.length) * 100,
      ),
      checks,
    };
  }
  function example(level) {
    const project = emptyProject(level.index);
    project.clips = level.events.map((e, i) =>
      defaultClip(
        sounds.find((s) => s.category === e.categories[0]).id,
        e.time,
        i % 3,
      ),
    );
    if (level.rule?.type === "repeat") {
      project.clips = [
        defaultClip(
          sounds.find((s) => s.category === level.events[0].categories[0]).id,
          level.events[0].time,
        ),
      ];
      project.clips[0].repeats = level.events.length;
      project.clips[0].gap = level.events[1].time - level.events[0].time;
    }
    if (level.rule?.type === "speed") project.clips[0].speed = 1.5;
    if (level.rule?.type === "trim") {
      project.clips[0].trimStart = 0.12;
      project.clips[0].trimEnd = 0.6;
    }
    return project;
  }
  function renderMix(project, getSamples, rate = RATE) {
    const out = new Float32Array(Math.ceil(project.duration * rate));
    for (const c of expanded(project.clips, project.duration)) {
      const source = getSamples(c.soundId),
        count = Math.min(
          Math.ceil(c.length * rate),
          out.length - Math.round(c.onset * rate),
        ),
        offset = Math.round(c.onset * rate);
      if (!source) continue;
      for (let i = 0; i < count; i++) {
        const at = (c.trimStart + (i / rate) * c.speed) * rate,
          lo = Math.floor(at),
          f = at - lo;
        const sample = (source[lo] || 0) * (1 - f) + (source[lo + 1] || 0) * f;
        const fade = Math.min(
          1,
          i / (rate * 0.005),
          (count - i) / (rate * 0.01),
        );
        out[offset + i] += sample * c.gain * fade;
      }
    }
    let peak = 0;
    for (const x of out) peak = Math.max(peak, Math.abs(x));
    if (peak > 0.95) for (let i = 0; i < out.length; i++) out[i] *= 0.95 / peak;
    return out;
  }
  function wav(samples, rate = RATE) {
    const buffer = new ArrayBuffer(44 + samples.length * 2),
      v = new DataView(buffer);
    const str = (at, s) =>
      [...s].forEach((c, i) => v.setUint8(at + i, c.charCodeAt(0)));
    str(0, "RIFF");
    v.setUint32(4, 36 + samples.length * 2, true);
    str(8, "WAVEfmt ");
    v.setUint32(16, 16, true);
    v.setUint16(20, 1, true);
    v.setUint16(22, 1, true);
    v.setUint32(24, rate, true);
    v.setUint32(28, rate * 2, true);
    v.setUint16(32, 2, true);
    v.setUint16(34, 16, true);
    str(36, "data");
    v.setUint32(40, samples.length * 2, true);
    for (let i = 0; i < samples.length; i++)
      v.setInt16(
        44 + i * 2,
        Math.round(Math.max(-1, Math.min(1, samples[i])) * 32767),
        true,
      );
    return buffer;
  }
  return {
    RATE,
    MAX_CLIPS,
    MAX_DURATION,
    groups,
    sounds,
    levels,
    byId,
    synth,
    defaultClip,
    validateProject,
    emptyProject,
    expanded,
    evaluate,
    example,
    renderMix,
    wav,
  };
});
