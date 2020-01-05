import pyaudio
import socket
import sys

FORMAT = pyaudio.paInt16
CHANNEL_COUNT = 1
BITRATE = 44100
CHUNK_SIZE = 4096

server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.connect((sys.argv[1], int(sys.argv[2])))
audio = pyaudio.PyAudio()
audio_stream = audio.open(
    channels=CHANNEL_COUNT,
    format=FORMAT,
    frames_per_buffer=CHUNK_SIZE,
    output=True,
    rate=BITRATE)

try:
    while True:
        data = server.recv(CHUNK_SIZE)
        audio_stream.write(data)
except KeyboardInterrupt:
    pass

print('Stopping')
server.close()
audio_stream.close()
audio.terminate()