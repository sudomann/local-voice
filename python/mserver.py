import pyaudio
import socket
import select
import sys

BITRATE = 44100
CHANNEL_COUNT = 1
CHUNK_SIZE = 4096
FORMAT = pyaudio.paInt16

audio = pyaudio.PyAudio()

server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind(('', int(sys.argv[2])))
server.listen(5)


def callback(in_data, frame_count, time_info, status):
    for s in scan_list[1:]:
        s.send(in_data)
    return (None, pyaudio.paContinue)


# start record
audio_stream = audio.open(
    stream_callback=callback,
    channels=CHANNEL_COUNT,
    format=FORMAT,
    frames_per_buffer=CHUNK_SIZE,
    input=True,
    rate=BITRATE)

scan_list = [server]
print ("Ready to transmit audio from",
        sys.argv[1],
        "on port",
        sys.argv[2])
print ("Waiting for client connection ...")

try:
    while True:
        readable, writable, errored = select.select(scan_list, [], [])
        for s in readable:
            if s is server:
                (clientsocket, address) = server.accept()
                scan_list.append(clientsocket)
                print (address, "has connected")
            else:
                data = s.recv(1024)
                if not data:
                    scan_list.remove(s)
except KeyboardInterrupt:
    pass


print ("finished recording")

server.close()
# stop Recording
audio_stream.stop_stream()
audio_stream.close()
audio.terminate()