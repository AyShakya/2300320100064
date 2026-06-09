# Stage 1

Core Actions ->
- Creation of notifications
- Fetching notifications
- Fetching a specific notification
- Marking notification as read
- Marking all notifications as read
- Deleting notification
- Get unread notification number
- Get real-time notifications

Notification Schema -> 
{
  "id": "_id",
  "studentId": "778xgy.....",
  "type": "Placement",
  "title": "Placement Opportunity",
  "message": "CSE Company is hiring.",
  "isRead": false,
  "createdAt": "2026-04-2........",
  "updatedAt": "2026-04-2........"
}

API Endpoints ->
    1. Creating Notification
        POST /api/notifications
            Request
            {
                "studentId": "12345",
                "type": "Placement",
                "title": "Placement Opportunity",
                "message": "CSE Company is hiring."
            }
            Response
            {
                "success": true,
                "notificationId": "uuid"
            }
    2. Fetching Notifications
        GET /api/notifications?page=1&limit=20&type=Placement
            Response
            {
                "notifications": [],
                "total": 120,
                "page": 1,
                "limit": 20
            }
    3. Fetching Notification By ID
        GET /api/notifications/{notificationId}
            Response
            {
                "notification": {}
            }
    4. Marking Notification As Read
        PATCH /api/notifications/{notificationId}/read
            Response
            {
                "success": true
            }
    5. Marking All Notifications As Read
        PATCH /api/notifications/read-all
            Response
            {
                "success": true,
                "updatedCount": 25
            }
    6. Deleting Notification
        DELETE /api/notifications/{notificationId}
            Response
            {
                "success": true
            }
    7. Get Unread Notification Number
        GET /api/notifications/unread-count
            Response
            {
                "count": 12
            }

Real-time Notification
    Technology Use - WebSockets (Socket.IO)
    FLow ->
        Admin/System -> Notification Service -> Database -> WebSocket Server -> Connected Student

