import json

__ev_seq = 0

def __ev_log(id_value, tag, data=None):
    global __ev_seq
    payload = {"__log": {"id": id_value, "tag": tag, "data": data, "seq": __ev_seq}}
    __ev_seq += 1
    print(json.dumps(payload))
