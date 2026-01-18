<?php
// Securely get Job ID and Title from URL
$job_id = isset($_GET['id']) ? htmlspecialchars($_GET['id']) : '';
$job_title = isset($_GET['title']) ? htmlspecialchars(urldecode($_GET['title'])) : 'N/A';

$error = '';
$success = '';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Sanitize all POST data
    $name = htmlspecialchars($_POST['name'] ?? '');
    $email = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
    $phone = htmlspecialchars($_POST['phone'] ?? '');
    $message = htmlspecialchars($_POST['message'] ?? '');
    
    // Basic validation
    if (empty($name) || empty($email) || empty($phone) || empty($message)) {
        $error = "Please fill in all required fields.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = "Invalid email format.";
    } elseif (!isset($_FILES['cv']) || $_FILES['cv']['error'] !== UPLOAD_ERR_OK) {
        $error = "CV is required. Please upload your CV.";
    } else {
        // --- Secure File Upload Handling ---
        $cv = $_FILES['cv'];
        $uploadDir = 'uploads/';

        // 1. Check directory existence and writability
        if (!is_dir($uploadDir)) {
            if (!mkdir($uploadDir, 0755, true)) {
                $error = "Server error: Unable to create upload directory.";
            }
        }
        if (!is_writable($uploadDir)) {
            $error = "Server error: Upload directory is not writable.";
        }

        if (empty($error)) {
            // 2. Validate File Size
            $maxSize = 2 * 1024 * 1024; // 2MB
            if ($cv['size'] > $maxSize) {
                $error = "File is too large. Maximum size is 2MB.";
            } else {
                // 3. Validate File Type (Extension and MIME Type)
                $allowedExtensions = ['pdf', 'doc', 'docx'];
                $allowedMimeTypes = [
                    'application/pdf', 
                    'application/msword', 
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                ];
                
                $fileExtension = strtolower(pathinfo($cv['name'], PATHINFO_EXTENSION));
                $fileMimeType = mime_content_type($cv['tmp_name']);

                if (!in_array($fileExtension, $allowedExtensions) || !in_array($fileMimeType, $allowedMimeTypes)) {
                    $error = "Invalid file type. Only PDF, DOC, and DOCX files are allowed.";
                } else {
                    // 4. Generate a unique, secure filename
                    $safeFilename = uniqid('cv_', true) . '.' . $fileExtension;
                    $cvPath = $uploadDir . $safeFilename;

                    // 5. Move the uploaded file
                    if (move_uploaded_file($cv['tmp_name'], $cvPath)) {
                        // --- Send Email ---
                        $to = "career@sog-bd.com";
                        $subject = "Job Application for: " . $job_title;
                        $headers = "From: noreply@sog-bd.com\r\n";
                        $headers .= "Reply-To: " . $email . "\r\n";
                        $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

                        $email_body = "A new job application has been received.\n\n";
                        $email_body .= "Job Title: " . $job_title . " (ID: " . $job_id . ")\n";
                        $email_body .= "Name: " . $name . "\n";
                        $email_body .= "Email: " . $email . "\n";
                        $email_body .= "Phone: " . $phone . "\n";
                        $email_body .= "Message:\n" . $message . "\n\n";
                        $email_body .= "The CV is attached to this application and can be found on the server at: " . $cvPath;


                        if (mail($to, $subject, $email_body, $headers)) {
                            $success = "Your application has been sent successfully! We will contact you shortly.";
                        } else {
                            $error = "Failed to send the email. Please try again later.";
                            // Clean up uploaded file if email fails
                            unlink($cvPath);
                        }
                    } else {
                        $error = "There was an error uploading your CV. Please try again.";
                    }
                }
            }
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Apply for <?= $job_title ?></title>
    <link href="https://fonts.googleapis.com/css2?family=Segoe+UI&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Segoe UI', sans-serif;
            background-color: #f0f2f5;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
        }
        .form-container {
            background: #ffffff;
            padding: 35px;
            border-radius: 12px;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
            max-width: 500px;
            width: 100%;
            box-sizing: border-box;
        }
        h2 {
            margin: 0 0 25px;
            font-size: 24px;
            color: #333;
            text-align: center;
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #555;
        }
        input, textarea {
            width: 100%;
            padding: 12px;
            border: 1px solid #ccd0d5;
            border-radius: 8px;
            box-sizing: border-box;
            font-size: 16px;
        }
        input:focus, textarea:focus {
            outline: none;
            border-color: #4CAF50;
            box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
        }
        .file-input-wrapper {
            margin-top: 5px;
            font-size: 14px;
            color: #666;
        }
        button[type="submit"] {
            background-color: #4CAF50;
            color: white;
            padding: 14px 0;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            font-size: 16px;
            width: 100%;
            transition: background-color 0.3s;
        }
        button[type="submit"]:hover {
            background-color: #45a049;
        }
        .message {
            margin-bottom: 20px;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
        }
        .success { background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .error { background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
    </style>
</head>
<body>
    <div class="form-container">
        <h2>Apply for: <?= $job_title ?></h2>

        <?php if (!empty($success) && $_SERVER["REQUEST_METHOD"] == "POST"): ?>
            <div class="message success"><?= $success ?></div>
        <?php endif; ?>
        
        <?php if (!empty($error)): ?>
            <div class="message error"><?= $error ?></div>
        <?php endif; ?>

        <?php if (empty($success) || $_SERVER["REQUEST_METHOD"] != "POST"): ?>
        <form method="POST" enctype="multipart/form-data" novalidate>
            <div class="form-group">
                <label for="name">Full Name</label>
                <input type="text" id="name" name="name" required>
            </div>
            <div class="form-group">
                <label for="email">Email Address</label>
                <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
                <label for="phone">Phone Number</label>
                <input type="text" id="phone" name="phone" required>
            </div>
            <div class="form-group">
                <label for="message">Cover Letter</label>
                <textarea id="message" name="message" rows="5" required></textarea>
            </div>
            <div class="form-group">
                <label for="cv">Upload CV</label>
                <input type="file" id="cv" name="cv" accept=".pdf,.doc,.docx" required>
                <div class="file-input-wrapper">PDF, DOC, or DOCX only. Max size: 2MB.</div>
            </div>
            <button type="submit">Submit Application</button>
        </form>
        <?php endif; ?>
    </div>
</body>
</html>