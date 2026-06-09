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

Real-time Notifications ->
    Technology Use - WebSockets (Socket.IO)
    FLow ->
        Admin/System -> Notification Service -> Database -> WebSocket Server -> Connected Student

# Stage 2

Database Selection ->
    I will choose PostgreSQL as for my persistent storage(DB) 
    Because it provides
        1. ACID properties.
        2. Gurantees strong consistency throughout the flow.
        3. Very good indexing for faster search.
        4. Provides efficient sorting.
    
Database Schema -> 
    1. Notifications Table
        CREATE TABLE notifications (
            id UUID PRIMARY KEY,
            studentId BIGINT NOT NULL,
            type VARCHAR(20) NOT NULL,
            title VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            is_read BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
    2. Indexes
        CREATE INDEX idx_notifications_student ON notifications(student_id);

        CREATE INDEX idx_notifications_read ON notifications(is_read);

        CREATE INDEX idx_notifications_created ON notifications(created_at);

        CREATE INDEX idx_notifications_student_read_created ON notifications(student_id, is_read, created_at DESC);

Queries Based on Stage 1 APIs ->
    1. Create Notification
        INSERT INTO notifications (
            id,
            studentId,
            type,
            title,
            message
        )
        VALUES (
            xfgty67........,
            1042,
            'Placement',
            'Placement Opportunity',
            'CSE Company is hiring'
        );
    2. Get Notifications
        SELECT *
        FROM notifications
        WHERE studentId = 1042
        ORDER BY created_at DESC
        LIMIT 20 OFFSET 0;
    3. Get Notification By ID
        SELECT *
        FROM notifications
        WHERE id = 'notification-id';
    4. Mark Notification As Read
        UPDATE notifications
        SET is_read = TRUE,
        updated_at = CURRENT_TIMESTAMP
        WHERE id = 'notification-id';
    5. Mark All Notifications As Read
        UPDATE notifications
        SET is_read = TRUE,
        updated_at = CURRENT_TIMESTAMP
        WHERE studentId = 1042
        AND is_read = FALSE;
    6. Delete Notification
        DELETE
        FROM notifications
        WHERE id = 'notification-id';
    7. Get Unread Count
        SELECT COUNT(*)
        FROM notifications
        WHERE studentId = 1042
        AND is_read = FALSE;

Challenges as Data Volume Grows ->
    1. Slow Reads - with large amount of entires, speed of each read query will be slower.
        Solutions - we can create composite indexes.
        Ex - (student_id, is_read, created_at)
    2. Pool oveflow - with large amount of users, the no. of requests going to the db pool will overflow it.
        Solutions - we can add a job queue before db.
        Ex - something like rabbitMQ.
    3. Expensive sorting - similar to slow reads.
        Solutions - store the notifications already in sorted form.
        Ex - ORDER BY created_at DESC