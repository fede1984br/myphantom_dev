import os
from adk.server.app import app

os.environ['ADK_AGENT_DIR'] = 'my_agent'

port = int(os.environ.get("PORT", 8080))

if __name__ == "__main__":
  app.run(host="0.0.0.0", port=port)