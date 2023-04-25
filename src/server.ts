import express, { Request, Response } from "express";
const bodyParser = require("body-parser");
const { spawn } = require("child_process");

const app = express();
app.use(express.urlencoded({ extended: false }));

app.post("/api/run", async (req: Request, res: Response) => {
  const script : string = req.body.script;
  let inputs : string = req.body.inputs;

  const pythonArgs : string[] = ["-c", script];
  const python : any = await spawn("python", pythonArgs);

  let output : string = "";

  python.stdout.on("data", (data: any) => {
    output += data.toString();
  });

  python.stderr.on("data", (data: any) => {
    output += data.toString();
  });

  python.stdin.write(inputs);
  python.stdin.end();

  await python.on("close", async (code: any) => {
    if (code === 0) {
      await res.status(200).json({ success: true, data: { source: script, inputs: inputs, output: output, code: code, language: "py", time: Date.now() } }).end();
    } else {
      await res.status(400).json({ success: false, data: { source: script, inputs: inputs, output: output, code: code, language: "py", time: Date.now() } }).end();
    }
  });
});


const port : number = 3000;
app.listen(port);