<?php
$admin_password = 'admin123';
$user_password = 'user123';

echo "Admin password hash: " . password_hash($admin_password, PASSWORD_BCRYPT) . "\n";
echo "User password hash: " . password_hash($user_password, PASSWORD_BCRYPT) . "\n"; 