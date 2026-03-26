globalThis.__evSeq = 0;
globalThis.__evLog = (id, tag, data) => {
  const payload = {
    __log: {
      id,
      tag,
      data,
      seq: globalThis.__evSeq++,
    },
  };
  process.stdout.write(`${JSON.stringify(payload)}\n`);
};
