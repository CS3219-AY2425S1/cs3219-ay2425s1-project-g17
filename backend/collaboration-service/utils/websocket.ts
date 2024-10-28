// y-webrtc signaling server from
// https://github.com/yjs/y-webrtc/blob/master/bin/server.js

import WebSocket, { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ noServer: true })

const pingTimeout = 30000

const wsReadyStateConnecting = 0
const wsReadyStateOpen = 1
const wsReadyStateClosing = 2 // eslint-disable-line
const wsReadyStateClosed = 3 // eslint-disable-line

/**
 * Map froms topic-name to set of subscribed clients.
 * @type {Map<string, Set<any>>}
 */
const topics = new Map()

/**
 * @param {any} conn
 * @param {object} message
 */
const send = (conn: WebSocket, message: Record<string, unknown>) => {
  if (conn.readyState !== wsReadyStateConnecting && conn.readyState !== wsReadyStateOpen) {
    conn.close()
  }
  try {
    conn.send(JSON.stringify(message))
  } catch (e) {
    conn.close()
  }
}

/**
 * Setup a new client
 * @param {any} conn
 */
const onconnection = (conn: WebSocket): void => {
  /**
   * @type {Set<string>}
   */
  const subscribedTopics = new Set()
  let closed = false
  // Check if connection is still alive
  let pongReceived = true
  const pingInterval = setInterval(() => {
    if (!pongReceived) {
      conn.close()
      clearInterval(pingInterval)
    } else {
      pongReceived = false
      try {
        conn.ping()
      } catch (e) {
        conn.close()
      }
    }
  }, pingTimeout)
  conn.on('pong', () => {
    pongReceived = true
  })
  conn.on('close', () => {
    subscribedTopics.forEach(topicName => {
      const subs = topics.get(topicName) || new Set()
      subs.delete(conn)
      if (subs.size === 0) {
        topics.delete(topicName)
      }
    })
    subscribedTopics.clear()
    closed = true
  })
  conn.on('message', (message: string | Buffer) => {
    let messageJson: { type: string; topics?: string[]; topic?: string; clients?: number } | null = null;
    // Parse the message if it's a string or Buffer
    if (typeof message === 'string' || message instanceof Buffer) {
        messageJson = JSON.parse(message.toString());
    }
    if (message && messageJson?.type && !closed) {
      switch (messageJson.type) {
        case 'subscribe':
          /** @type {Array<string>} */ (messageJson.topics || []).forEach((topicName: string) => {
            if (typeof topicName === 'string') {
              // add conn to topic
              // Check if the topic already exists; if not, create a new Set
              let topic = topics.get(topicName);
              if (!topic) {
                  topic = new Set<WebSocket>();
                  topics.set(topicName, topic);
              }
              // Add the connection to the topic
              topic.add(conn);
              // Add the topic to the subscribed topics
              subscribedTopics.add(topicName);
            }
          })
          break
        case 'unsubscribe':
          /** @type {Array<string>} */ (messageJson.topics || []).forEach((topicName: string) => {
            const subs = topics.get(topicName)
            if (subs) {
              subs.delete(conn)
            }
          })
          break
        case 'publish':
          if (messageJson.topic) {
            const receivers = topics.get(messageJson.topic)
            if (receivers) {
              messageJson.clients = receivers.size
              receivers.forEach((receiver: WebSocket) =>
                send(receiver, messageJson)
              )
            }
          }
          break
        case 'ping':
          send(conn, { type: 'pong' })
      }
    }
  })
}

wss.on('connection', onconnection)

export { wss };