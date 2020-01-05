# Basic Python Voice Chat Over Local Network

On the first machine, do:

```
python mserver.py <hostIP> <hostPort>
```

Then on the second machine,

```
python mclient.py <hostIP> <hostPort>
```

Resusing the server's `hostIP` and `hostPort`.

Then invert the process on both machines, and you have full duplex communication.