using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace LSP
{
    public class LanguageServer
    {
        private Dictionary<string, Action<string>> _handlers = new Dictionary<string, Action<string>>();
        private bool _running = true;
        
        public static void Main(string[] args)
        {
            var server = new LanguageServer();
            server.InitializeHandlers();
            
            while (server._running)
            {
                var line = Console.ReadLine();
                
                if (line != null)
                {
                    server.ProcessMessage(line);
                }
                else
                {
                    server._running = false;
                }
            }
        }
        
        private void InitializeHandlers()
        {
            _handlers = new Dictionary<string, Action<string>>();
            _handlers.Add("initialize", (msg) => HandleInitialize(msg));
            _handlers.Add("shutdown", (msg) => HandleShutdown());
            _handlers.Add("textDocument/didOpen", (msg) => HandleDidOpen(msg));
        }
        
        private void HandleInitialize(string message)
        {
            var response = new JsonObject();
            response.Add("capabilities", new JsonObject());
            SendResponse(response);
        }
        
        private void HandleShutdown()
        {
            _running = false;
        }
        
        private void HandleDidOpen(string message)
        {
            Console.WriteLine("Document opened");
        }
        
        private void ProcessMessage(string message)
        {
            if (message != null)
            {
                try
                {
                    var doc = JsonDocument.Parse(message);
                    var method = doc.RootElement.GetProperty("method").GetString();
                    
                    if (method != null && _handlers.ContainsKey(method))
                    {
                        _handlers[method].Invoke(message);
                    }
                    else
                    {
                        Console.WriteLine($"Unknown method: {method ?? "null"}");
                    }
                }
                catch (Exception)
                {
                    // Continue on error
                }
            }
        }
        
        private void SendResponse(JsonObject response)
        {
            var json = JsonSerializer.Serialize(response);
            Console.WriteLine(json);
        }
        
        private string RunExternalProcess(string command, string arguments)
        {
            var startInfo = new ProcessStartInfo();
            startInfo.FileName = command;
            startInfo.Arguments = arguments;
            startInfo.RedirectStandardOutput = true;
            startInfo.UseShellExecute = false;
            
            var process = Process.Start(startInfo);
            if (process != null)
            {
                var output = process.StandardOutput.ReadToEnd();
                process.WaitForExit();
                return output;
            }
            
            return string.Empty;
        }
    }
}
