-- بيانات تجريبية للعملاء
INSERT INTO clients (id, name, contact_info)
VALUES 
  ('b850e25b-76c7-4c7b-90d0-56ee22c8110d', 'شركة الأفق للتسويق', 'info@horizon.example.com'),
  ('f2c1b59b-1bb6-4af3-ab7a-1461cf71e146', 'مؤسسة الإبداع', 'contact@creativity.example.com'),
  ('1f8c3d4a-3e9f-4b0e-9a2d-3b5c7c8d9e0f', 'مجموعة النجاح', 'success@group.example.com');

-- بيانات تجريبية للمشاريع
INSERT INTO projects (id, client_id, title, subscription_type, start_date, end_date, status)
VALUES 
  ('a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d', 'b850e25b-76c7-4c7b-90d0-56ee22c8110d', 'تطوير موقع الويب الجديد', 'design-only', '2023-06-01', '2023-12-31', 'active'),
  ('4b6c8d0e-2f4a-6b8c-0d2e-4f6a8b0c2d4e', 'b850e25b-76c7-4c7b-90d0-56ee22c8110d', 'تطبيق الجوال للمبيعات', 'design + social', '2023-05-15', '2023-11-15', 'active'),
  ('9a8b7c6d-5e4f-3a2b-1c0d-9e8f7a6b5c4d', 'f2c1b59b-1bb6-4af3-ab7a-1461cf71e146', 'نظام إدارة المخزون', 'design-only', '2023-06-10', '2023-09-10', 'active');

-- بيانات تجريبية للمستخدمين (كلمة المرور هي "password123" مشفرة)
INSERT INTO users (id, email, role, password_hash)
VALUES 
  ('1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 'admin@example.com', 'Owner', '$2a$10$rQ7xrkyB3YzMa1fONJQK3OQMfGwLs4zQ9y6qJMES/qAJ1D2CYL5N2'),
  ('2c3d4e5f-6a7b-8c9d-0e1f-2a3b4c5d6e7f', 'manager@example.com', 'Project Manager', '$2a$10$rQ7xrkyB3YzMa1fONJQK3OQMfGwLs4zQ9y6qJMES/qAJ1D2CYL5N2'),
  ('3e4f5a6b-7c8d-9e0f-1a2b-3c4d5e6f7a8b', 'designer@example.com', 'Designer', '$2a$10$rQ7xrkyB3YzMa1fONJQK3OQMfGwLs4zQ9y6qJMES/qAJ1D2CYL5N2');

-- بيانات تجريبية للمهام
INSERT INTO tasks (id, project_id, assigned_user, task_type, status, due_date, number_of_designs)
VALUES 
  ('7f8e9d0c-1b2a-3c4d-5e6f-7a8b9c0d1e2f', 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d', '3e4f5a6b-7c8d-9e0f-1a2b-3c4d5e6f7a8b', 'new design', 'completed', '2023-06-15', 1),
  ('8a9b0c1d-2e3f-4a5b-6c7d-8e9f0a1b2c3d', 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d', '3e4f5a6b-7c8d-9e0f-1a2b-3c4d5e6f7a8b', 'new design', 'in_progress', '2023-06-20', 2),
  ('9c0d1e2f-3a4b-5c6d-7e8f-9a0b1c2d3e4f', 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d', '3e4f5a6b-7c8d-9e0f-1a2b-3c4d5e6f7a8b', 'new design', 'pending', '2023-06-25', 1),
  ('0e1f2a3b-4c5d-6e7f-8a9b-0c1d2e3f4a5b', '4b6c8d0e-2f4a-6b8c-0d2e-4f6a8b0c2d4e', '3e4f5a6b-7c8d-9e0f-1a2b-3c4d5e6f7a8b', 'edit', 'on_hold', '2023-06-18', 1),
  ('1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', '4b6c8d0e-2f4a-6b8c-0d2e-4f6a8b0c2d4e', '3e4f5a6b-7c8d-9e0f-1a2b-3c4d5e6f7a8b', 'new design', 'in_progress', '2023-06-12', 3),
  ('2c3d4e5f-6a7b-8c9d-0e1f-2a3b4c5d6e7f', 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d', '3e4f5a6b-7c8d-9e0f-1a2b-3c4d5e6f7a8b', 'edit', 'in_progress', '2023-06-22', 1),
  ('3e4f5a6b-7c8d-9e0f-1a2b-3c4d5e6f7a8b', '9a8b7c6d-5e4f-3a2b-1c0d-9e8f7a6b5c4d', '3e4f5a6b-7c8d-9e0f-1a2b-3c4d5e6f7a8b', 'new design', 'completed', '2023-05-30', 2),
  ('4a5b6c7d-8e9f-0a1b-2c3d-4e5f6a7b8c9d', 'a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d', '3e4f5a6b-7c8d-9e0f-1a2b-3c4d5e6f7a8b', 'edit', 'overdue', '2023-06-05', 1),
  ('5b6c7d8e-9f0a-1b2c-3d4e-5f6a7b8c9d0e', '4b6c8d0e-2f4a-6b8c-0d2e-4f6a8b0c2d4e', '3e4f5a6b-7c8d-9e0f-1a2b-3c4d5e6f7a8b', 'new design', 'on_hold', '2023-06-28', 2),
  ('6c7d8e9f-0a1b-2c3d-4e5f-6a7b8c9d0e1f', '9a8b7c6d-5e4f-3a2b-1c0d-9e8f7a6b5c4d', '3e4f5a6b-7c8d-9e0f-1a2b-3c4d5e6f7a8b', 'new design', 'pending', '2023-07-05', 1);

-- بيانات تجريبية للتعليقات
INSERT INTO comments (task_id, user_id, comment)
VALUES 
  ('7f8e9d0c-1b2a-3c4d-5e6f-7a8b9c0d1e2f', '2c3d4e5f-6a7b-8c9d-0e1f-2a3b4c5d6e7f', 'تم الانتهاء من التصميم، يرجى المراجعة'),
  ('8a9b0c1d-2e3f-4a5b-6c7d-8e9f0a1b2c3d', '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 'يجب تعديل الألوان لتتناسب مع هوية العلامة التجارية');

-- بيانات تجريبية للملفات
INSERT INTO files (project_id, task_id, file_name, file_url, file_size, file_type, uploaded_by)
VALUES 
  ('a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d', '7f8e9d0c-1b2a-3c4d-5e6f-7a8b9c0d1e2f', 'تصميم_الصفحة_الرئيسية.psd', 'https://example.com/files/homepage_design.psd', 15000000, 'application/psd', '3e4f5a6b-7c8d-9e0f-1a2b-3c4d5e6f7a8b'),
  ('a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d', '8a9b0c1d-2e3f-4a5b-6c7d-8e9f0a1b2c3d', 'شعار_الشركة.ai', 'https://example.com/files/company_logo.ai', 5000000, 'application/illustrator', '3e4f5a6b-7c8d-9e0f-1a2b-3c4d5e6f7a8b');

-- بيانات تجريبية لحسابات وسائل التواصل الاجتماعي (ملاحظة: في الإنتاج، يجب تشفير البيانات الحساسة)
INSERT INTO social_credentials (user_id, platform, encrypted_username, encrypted_email, encrypted_password)
VALUES 
  ('1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 'Instagram', 'instagram_user', 'insta@example.com', 'encrypted_password_here'),
  ('1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 'Twitter', 'twitter_user', 'twitter@example.com', 'encrypted_password_here');

-- بيانات تجريبية لسجل النشاطات
INSERT INTO activity_feed (project_id, task_id, user_id, action_type, details)
VALUES 
  ('a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d', '7f8e9d0c-1b2a-3c4d-5e6f-7a8b9c0d1e2f', '3e4f5a6b-7c8d-9e0f-1a2b-3c4d5e6f7a8b', 'task_completed', '{"task_title": "تصميم الصفحة الرئيسية"}'),
  ('a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d', '8a9b0c1d-2e3f-4a5b-6c7d-8e9f0a1b2c3d', '2c3d4e5f-6a7b-8c9d-0e1f-2a3b4c5d6e7f', 'task_comment', '{"comment_id": "1"}'); 