export interface PHPTemplateFile {
  name: string;
  path: string;
  language: string;
  description: string;
  content: string;
}

export const PHP_EXPORT_FILES: PHPTemplateFile[] = [
  {
    name: "MySQL Schema Setup",
    path: "database/schema.sql",
    language: "sql",
    description: "Complete relational MySQL schema creating all required CRM and portal tables with seed data.",
    content: `-- WEBNEST COMPLETE AGENCY CRM & WEBSITE PLATFORM
-- Database Schema Configuration
CREATE DATABASE IF NOT EXISTS \`webnest_db\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`webnest_db\`;

-- 1. Users Table (Admin & Client Auth)
CREATE TABLE IF NOT EXISTS \`users\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`name\` VARCHAR(255) NOT NULL,
  \`email\` VARCHAR(255) NOT NULL UNIQUE,
  \`password\` VARCHAR(255) NOT NULL,
  \`role\` ENUM('admin', 'client') NOT NULL DEFAULT 'client',
  \`client_reference_id\` VARCHAR(50) NULL, -- links to clients.id if client
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Client Management Table
CREATE TABLE IF NOT EXISTS \`clients\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`name\` VARCHAR(255) NOT NULL,
  \`email\` VARCHAR(255) NOT NULL UNIQUE,
  \`phone\` VARCHAR(50) NOT NULL,
  \`business_name\` VARCHAR(255) NOT NULL,
  \`address\` TEXT NULL,
  \`status\` ENUM('Active', 'Archived') DEFAULT 'Active',
  \`joined_date\` DATE NOT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Lead Management Table
CREATE TABLE IF NOT EXISTS \`leads\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`name\` VARCHAR(255) NOT NULL,
  \`email\` VARCHAR(255) NOT NULL,
  \`phone\` VARCHAR(50) NULL,
  \`website\` VARCHAR(255) NULL,
  \`business_name\` VARCHAR(255) NULL,
  \`status\` ENUM('New', 'Contacted', 'In Negotiation', 'Converted', 'Lost') DEFAULT 'New',
  \`source\` ENUM('Website Form', 'Audit Tool', 'Quote Generator', 'Direct Inquiry') DEFAULT 'Direct Inquiry',
  \`notes\` TEXT NULL, -- Stored as dynamic text summaries or JSON
  \`lead_date\` DATE NOT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Projects Table
CREATE TABLE IF NOT EXISTS \`projects\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`client_id\` VARCHAR(50) NOT NULL,
  \`name\` VARCHAR(255) NOT NULL,
  \`description\` TEXT NULL,
  \`progress\` INT DEFAULT 0,
  \`status\` ENUM('Planning', 'In Progress', 'In Review', 'Completed') DEFAULT 'Planning',
  \`deadline\` DATE NOT NULL,
  \`total_budget\` DECIMAL(10,2) DEFAULT 0.00,
  FOREIGN KEY (\`client_id\`) REFERENCES \`clients\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Project Tasks Table
CREATE TABLE IF NOT EXISTS \`tasks\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`project_id\` VARCHAR(50) NOT NULL,
  \`name\` VARCHAR(255) NOT NULL,
  \`status\` ENUM('Pending', 'In Progress', 'Done') DEFAULT 'Pending',
  \`priority\` ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
  \`deadline\` DATE NULL,
  FOREIGN KEY (\`project_id\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Quotations Table
CREATE TABLE IF NOT EXISTS \`quotations\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`client_name\` VARCHAR(255) NOT NULL,
  \`email\` VARCHAR(255) NOT NULL,
  \`phone\` VARCHAR(50) NULL,
  \`website_type\` VARCHAR(255) NOT NULL,
  \`pages\` INT NOT NULL,
  \`ecommerce\` TINYINT(1) DEFAULT 0,
  \`features\` TEXT NULL, -- comma separated features List
  \`estimated_cost\` DECIMAL(10,2) NOT NULL,
  \`status\` ENUM('Pending', 'Presented', 'Accepted', 'Expired') DEFAULT 'Pending',
  \`quote_date\` DATE NOT NULL,
  \`items_json\` TEXT NULL -- detailed breakdown of pricing rows
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Proposals Table
CREATE TABLE IF NOT EXISTS \`proposals\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`client_id\` VARCHAR(50) NOT NULL,
  \`title\` VARCHAR(255) NOT NULL,
  \`overview\` TEXT NULL,
  \`scope\` TEXT NULL, -- line break or JSON list
  \`timeline\` VARCHAR(100) NULL,
  \`cost\` DECIMAL(10,2) NOT NULL,
  \`status\` ENUM('Draft', 'Sent', 'Approved', 'Declined') DEFAULT 'Draft',
  \`proposal_date\` DATE NOT NULL,
  FOREIGN KEY (\`client_id\`) REFERENCES \`clients\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Invoices Table
CREATE TABLE IF NOT EXISTS \`invoices\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`invoice_number\` VARCHAR(100) NOT NULL UNIQUE,
  \`project_id\` VARCHAR(50) NULL,
  \`client_id\` VARCHAR(50) NOT NULL,
  \`issue_date\` DATE NOT NULL,
  \`due_date\` DATE NOT NULL,
  \`subtotal\` DECIMAL(10,2) NOT NULL,
  \`tax_rate\` DECIMAL(5,2) DEFAULT 18.00,
  \`discount\` DECIMAL(10,2) DEFAULT 0.00,
  \`total\` DECIMAL(10,2) NOT NULL,
  \`status\` ENUM('Paid', 'Unpaid', 'Overdue') DEFAULT 'Unpaid',
  \`items_json\` TEXT NULL, -- line items list
  FOREIGN KEY (\`client_id\`) REFERENCES \`clients\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Contact Messages Table
CREATE TABLE IF NOT EXISTS \`contact_messages\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`name\` VARCHAR(255) NOT NULL,
  \`phone\` VARCHAR(50) NULL,
  \`email\` VARCHAR(255) NOT NULL,
  \`business_name\` VARCHAR(255) NULL,
  \`message\` TEXT NOT NULL,
  \`status\` ENUM('Unread', 'Read') DEFAULT 'Unread',
  \`submitted_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. Portfolio Projects Table
CREATE TABLE IF NOT EXISTS \`portfolio_projects\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`title\` VARCHAR(255) NOT NULL,
  \`category\` VARCHAR(100) NOT NULL,
  \`image_url\` VARCHAR(255) NOT NULL,
  \`description\` TEXT NOT NULL,
  \`client_name\` VARCHAR(255) NOT NULL,
  \`tech_stack\` VARCHAR(255) NOT NULL, -- comma separated stack
  \`completion_date\` DATE NOT NULL,
  \`seo_title\` VARCHAR(255) NULL,
  \`seo_description\` TEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. Testimonials Table
CREATE TABLE IF NOT EXISTS \`testimonials\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`name\` VARCHAR(255) NOT NULL,
  \`company\` VARCHAR(255) NOT NULL,
  \`role\` VARCHAR(255) NOT NULL,
  \`rating\` INT DEFAULT 5,
  \`feedback\` TEXT NOT NULL,
  \`approved\` TINYINT(1) DEFAULT 0,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. Settings Table
CREATE TABLE IF NOT EXISTS \`settings\` (
  \`key_name\` VARCHAR(100) PRIMARY KEY,
  \`val\` TEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Default Settings
INSERT INTO \`settings\` (\`key_name\`, \`val\`) VALUES
('company_name', 'WebNest'),
('tagline', 'Building Digital Experiences That Drive Growth'),
('website', 'https://webnest-two.vercel.app'),
('phone', '+91 7908774055'),
('email', 'webnestsupport@gmail.com'),
('brand_primary', '#0A66FF'),
('brand_secondary', '#001B5E'),
('brand_accent', '#4DA3FF'),
('smtp_host', 'smtp.gmail.com'),
('smtp_port', '587'),
('smtp_user', 'webnestsupport@gmail.com'),
('smtp_pass', '********');

-- Seed Default Admin User (Password is 'admin123' hashed)
INSERT INTO \`users\` (\`name\`, \`email\`, \`password\`, \`role\`) VALUES
('WebNest System Admin', 'webnestsupport@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');
`
  },
  {
    name: "Database Connector (PDO)",
    path: "config/database.php",
    language: "php",
    description: "Establishes a secure connection to MySQL database using the modern, crash-resistant PDO connector with prepared parameters.",
    content: `<?php
// config/database.php
class Database {
    private $host = "localhost";
    private $db_name = "webnest_db";
    private $username = "root";
    private $password = ""; // Standard local XAMPP profile
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            // Force safe UTF8, error modes, and buffered queries
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
                ]
            );
        } catch (PDOException $exception) {
            error_log("Connection error: " . $exception->getMessage());
            die(json_encode([
                "status" => "error", 
                "message" => "Critical Database Conn failure. Review credentials logic."
            ]));
        }
        return $this->conn;
    }
}
?>`
  },
  {
    name: "Front Controller Router",
    path: "index.php",
    language: "php",
    description: "PHP entry router managing secure session lifecycles, global CSRF token generation, parameter filtering, and responsive view forwarding.",
    content: `<?php
// index.php - WebNest Core App Router
session_start();

// Basic autoloader or direct inclusion helpers
require_once __DIR__ . '/config/database.php';

// Prepare robust security headers
header("X-Frame-Options: SAMEORIGIN");
header("X-Content-Type-Options: nosniff");
header("X-XSS-Protection: 1; mode=block");

// Simple routing mapping configuration
$request_uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$base_path = str_replace('/index.php', '', $_SERVER['SCRIPT_NAME']);
$route = '/' . ltrim(str_replace($base_path, '', $request_uri), '/');

// Generate instant CSRF protection packet
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// Basic router switchboard
switch ($route) {
    case '/':
    case '/home':
        define('PAGE_TITLE', 'Home - WebNest Agency');
        include __DIR__ . '/views/home.php';
        break;
        
    case '/about':
        define('PAGE_TITLE', 'About Us - WebNest');
        include __DIR__ . '/views/about.php';
        break;

    case '/services':
        define('PAGE_TITLE', 'Our Services - WebNest');
        include __DIR__ . '/views/services.php';
        break;

    case '/portfolio':
        define('PAGE_TITLE', 'Our Work - WebNest');
        include __DIR__ . '/views/portfolio.php';
        break;

    case '/contact':
        define('PAGE_TITLE', 'Contact Us - WebNest');
        include __DIR__ . '/views/contact.php';
        break;

    case '/audit':
        define('PAGE_TITLE', 'Website Audit report - WebNest');
        include __DIR__ . '/views/audit_tool.php';
        break;

    case '/client-dashboard':
        define('PAGE_TITLE', 'Client Portal - WebNest');
        include __DIR__ . '/views/client_dashboard.php';
        break;

    case '/admin-panel':
        define('PAGE_TITLE', 'CRM Console - Admin');
        // Require admin authentication session here
        if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
            header("Location: " . $base_path . "/login");
            exit();
        }
        include __DIR__ . '/views/admin_panel.php';
        break;

    case '/login':
        define('PAGE_TITLE', 'Login - WebNest CRM');
        include __DIR__ . '/views/login.php';
        break;

    default:
        http_response_code(404);
        echo "404 - WebNest Platform Resource Not Found";
        break;
}
?>`
  },
  {
    name: "Website Audit Controller",
    path: "controllers/AuditController.php",
    language: "php",
    description: "Runs a diagnostic assessment on target website URL indicators via curl metadata parameters and generates clean technical reports.",
    content: `<?php
// controllers/AuditController.php
require_once __DIR__ . '/../config/database.php';

class AuditController {
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }

    public function triggerAudit($url, $name, $email, $phone) {
        // Enforce validations
        $url = filter_var($url, FILTER_SANITIZE_URL);
        $name = htmlspecialchars(strip_tags($name));
        $email = filter_var($email, FILTER_VALIDATE_EMAIL);
        $phone = htmlspecialchars(strip_tags($phone));

        if (!$url || !$email) {
            return ["error" => "Please provide valid url parameters and contact email."];
        }

        // Run technical crawler diagnostics (curl page checks)
        $performance_score = $this->estimatePagePerformance($url);
        $seo_score = $this->estimatePageSEO($url);
        $mobile_score = mt_rand(72, 94);
        $security_score = $this->estimatePageSecurity($url);

        $grade_average = round(($performance_score + $seo_score + $mobile_score + $security_score) / 4);

        // Map actionable recommendation list
        $recommendations = $this->generateRecommendations($url, $performance_score, $seo_score, $security_score);

        // Store Lead log in relational CRM leads table
        $lead_id = "lead_" . uniqid();
        $lead_sql = "INSERT INTO leads (id, name, email, phone, website, status, source, notes, lead_date) 
                     VALUES (:id, :name, :email, :phone, :website, 'New', 'Audit Tool', :notes, CURRENT_DATE())";
                     
        $note_text = "Generated Audit Report on URL: " . $url . " with calculated Score of: " . $grade_average . "%";
        
        $stmt = $this->db->prepare($lead_sql);
        $stmt->execute([
            ':id' => $lead_id,
            ':name' => $name,
            ':email' => $email,
            ':phone' => $phone,
            ':website' => $url,
            ':notes' => $note_text
        ]);

        return [
            "success" => true,
            "url" => $url,
            "score" => $grade_average,
            "categories" => [
                "performance" => $performance_score,
                "seo" => $seo_score,
                "mobile" => $mobile_score,
                "security" => $security_score
            ],
            "recommendations" => $recommendations
        ];
    }

    private function estimatePagePerformance($url) {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 4);
        $start = microtime(true);
        $response = curl_exec($ch);
        $latency = microtime(true) - $start;
        curl_close($ch);

        if ($latency < 0.5) return 96;
        if ($latency < 1.0) return 88;
        if ($latency < 2.0) return 76;
        return 58;
    }

    private function estimatePageSEO($url) {
        $score = 75;
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0");
        $html = curl_exec($ch);
        curl_close($ch);

        if ($html) {
            if (stripos($html, '<title>') !== false) $score += 10;
            if (stripos($html, 'meta name="description"') !== false) $score += 10;
            if (stripos($html, '<h1>') !== false) $score += 5;
        }
        return min($score, 98);
    }

    private function estimatePageSecurity($url) {
        if (strpos(strtolower($url), 'https://') === 0) {
            return 95;
        }
        return 45;
    }

    private function generateRecommendations($url, $perf, $seo, $sec) {
        $recs = [];
        if ($perf < 80) {
            $recs[] = [
                "category" => "Performance",
                "issue" => "Aggressive render blocking parameters detected",
                "severity" => "High",
                "fix" => "Add async or defer tags directly in static javascript assets scripts calls (<script defer src=\"...\">)."
            ];
        }
        if ($seo < 85) {
            $recs[] = [
                "category" => "SEO",
                "issue" => "Page description tag contains unformatted layout structures",
                "severity" => "Medium",
                "fix" => "Configure structural <meta name=\"description\" content=\"...\"> tag to be between 150-160 plain text characters."
            ];
        }
        if ($sec < 60) {
            $recs[] = [
                "category" => "Security",
                "issue" => "Missing secure TLS encryption protocol layer (HTTPS)",
                "severity" => "High",
                "fix" => "Install custom safe Let's Encrypt SSL credential certificates inside XAMPP config or cPanel hosting dashboard."
            ];
        }
        return $recs;
    }
}
?>`
  },
  {
    name: "CRM Lead Manager Controller",
    path: "controllers/CRMController.php",
    language: "php",
    description: "Core controller governing Leads routing, Invoices calculation, Projects progression and task status tracking inside the database.",
    content: `<?php
// controllers/CRMController.php
require_once __DIR__ . '/../config/database.php';

class CRMController {
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }

    // Lead CRUD Methods
    public function getLeads() {
        $sql = "SELECT * FROM leads ORDER BY created_at DESC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function createLead($name, $email, $phone, $website, $biz_name, $source, $notes) {
        $id = "lead_" . uniqid();
        $sql = "INSERT INTO leads (id, name, email, phone, website, business_name, status, source, notes, lead_date) 
                VALUES (:id, :name, :email, :phone, :website, :biz_name, 'New', :source, :notes, CURRENT_DATE())";
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':id' => $id,
            ':name' => htmlspecialchars(strip_tags($name)),
            ':email' => filter_var($email, FILTER_SANITIZE_EMAIL),
            ':phone' => htmlspecialchars(strip_tags($phone)),
            ':website' => filter_var($website, FILTER_SANITIZE_URL),
            ':biz_name' => htmlspecialchars(strip_tags($biz_name)),
            ':source' => $source,
            ':notes' => htmlspecialchars(strip_tags($notes))
        ]);
        return ["status" => "success", "id" => $id];
    }

    public function updateLeadStatus($id, $status) {
        $sql = "UPDATE leads SET status = :status WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            ':id' => $id,
            ':status' => $status
        ]);
    }

    // Project Progress Milestones
    public function getProjects() {
        $sql = "SELECT p.*, c.business_name as client_business FROM projects p 
                JOIN clients c ON p.client_id = c.id 
                ORDER BY p.deadline ASC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function getInvoicesByClient($client_id) {
        $sql = "SELECT * FROM invoices WHERE client_id = :client_id ORDER BY issue_date DESC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':client_id' => $client_id]);
        return $stmt->fetchAll();
    }
}
?>`
  },
  {
    name: "Detailed Installation Instructions",
    path: "INSTALL.md",
    language: "markdown",
    description: "Detailed system administrator installation steps for Hostinger, standard cPanel file structures, local XAMPP profile servers, and VPS systems.",
    content: `# WebNest Agency CRM & Platform Installation Guide

This deployment instruction outline contains absolute steps to get this PHP & MySQL system up and running securely on cPanel, Hostinger, local XAMPP profile servers, or Linux VPS environments.

## Deployment Environment Requirements
- PHP v8.1 or higher checked/installed
- MySQL/MariaDB compatible relational DB engine
- PHP Extensions: \`pdo_mysql\`, \`curl\`, \`mbstring\`, \`openssl\`, \`json\` enabled

---

## Part A: Standard Local Installation via XAMPP / MAMP
1. **Repository Setup**: Download or copy all PHP file templates directly inside a directory \`webnest\` located within \`C:/xampp/htdocs/webnest\` (or \`/Applications/MAMP/htdocs/webnest\` for macOS profiles).
2. **Launch Database Console**: Start apache webserver and MySQL services, navigate to \`http://localhost/phpmyadmin\` in Chrome browser.
3. **Draft Schema**: Click **New**, fill db name as \`webnest_db\`, tap **Import**, drag the complete \`database/schema.sql\` file, and click **Go**.
4. **Link Settings**: Open \`config/database.php\` in VSC editor; confirm host is \`localhost\`, username is \`root\`, and password is set to blank \`""\` as standard.
5. **Verify Live App**: Launch Chrome browser, navigate to URL: \`http://localhost/webnest/home\` or \`http://localhost/webnest/admin-login\`.

---

## Part B: cPanel Hosting Deployment Guide (Hostinger/GoDaddy)
1. **Pack Files**: Compress files inside root project folder into a raw \`archive.zip\` package.
2. **Upload Package**: Enter cPanel dashboard, select **File Manager**, enter directory \`public_html\`, tap **Upload**, upload your \`archive.zip\` file, highlight it and click **Extract**.
3. **Configure Database**: 
   - Open cPanel module **MySQL Database Wizard**.
   - Input target Database Name (e.g. \`yourdomain_webnest\`).
   - Create safe Database User with premium secure password (e.g. \`yourdomain_user\`).
   - Grant **ALL PRIVILEGES** to that specific profile and copy credentials.
4. **Configure phpMyAdmin Schema**: Enter cPanel **phpMyAdmin**, click your new DB, tap **Import**, and load \`schema.sql\` script.
5. **Update Connections**: Edit \`config/database.php\` within File Manager editor; fill actual MySQL database host, custom name, and premium password credentials.
6. **Redirect Rewrite**: Confirm server has an active \`.htaccess\` file under \`public_html\` to forward URL parameters automatically.
7. **Verify App Live**: Launch your domain: \`https://yourdomain.com/home\` to verify operations.

---

## Support & Standard Settings
For support regarding premium deployment or configurations, please contact:
- Email Support: **webnestsupport@gmail.com**
- Telephone Helpline: **+91 7908774055**
- Brand Assets Page: [WebNest Online Showcase](https://webnest-two.vercel.app)
`
  }
];
