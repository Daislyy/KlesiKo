-- ============================================
-- KLESIKO LIBRARY DATABASE
-- MySQL 8.0+
-- ============================================

CREATE DATABASE IF NOT EXISTS klesiko_library;

USE klesiko_library;

-- ============================================
-- 1. USERS
-- ============================================

CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    full_name VARCHAR(150) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,

    role ENUM('admin', 'user') DEFAULT 'user',

    profile_image_url TEXT,
    profile_image_path TEXT,
    bio TEXT,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- 2. CATEGORIES
-- ============================================

CREATE TABLE IF NOT EXISTS categories (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 3. GENRES
-- ============================================

CREATE TABLE IF NOT EXISTS genres (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 4. BOOKS
-- ============================================

CREATE TABLE IF NOT EXISTS books (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),

    category_id CHAR(36),

    title VARCHAR(200) NOT NULL,
    author VARCHAR(150) NOT NULL,
    publisher VARCHAR(150),
    isbn VARCHAR(30) UNIQUE,

    description TEXT,
    cover_image_url TEXT,

    published_year SMALLINT,
    total_pages INT,

    stock INT NOT NULL DEFAULT 0,
    available_stock INT NOT NULL DEFAULT 0,

    status ENUM('available', 'unavailable')
        DEFAULT 'available',

    created_by CHAR(36),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_books_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_books_creator
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE SET NULL,

    CONSTRAINT chk_books_stock
        CHECK (stock >= 0 AND available_stock >= 0
               AND available_stock <= stock),

    CONSTRAINT chk_books_pages
        CHECK (total_pages IS NULL OR total_pages > 0)
);

-- ============================================
-- 5. BOOK GENRES
-- Many-to-Many Books and Genres
-- ============================================

CREATE TABLE IF NOT EXISTS book_genres (
    book_id CHAR(36) NOT NULL,
    genre_id CHAR(36) NOT NULL,

    PRIMARY KEY (book_id, genre_id),

    FOREIGN KEY (book_id)
        REFERENCES books(id)
        ON DELETE CASCADE,

    FOREIGN KEY (genre_id)
        REFERENCES genres(id)
        ON DELETE CASCADE
);

-- ============================================
-- 6. BOOK RATINGS
-- Rating bintang dan review komentar
-- ============================================

CREATE TABLE IF NOT EXISTS book_ratings (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),

    user_id CHAR(36) NOT NULL,
    book_id CHAR(36) NOT NULL,

    rating TINYINT NOT NULL,
    review TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_rating
        CHECK (rating BETWEEN 1 AND 5),

    CONSTRAINT fk_rating_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_rating_book
        FOREIGN KEY (book_id)
        REFERENCES books(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_user_book_rating
        UNIQUE (user_id, book_id)
);

-- ============================================
-- 7. BORROWINGS
-- Transaksi peminjaman
-- ============================================

CREATE TABLE IF NOT EXISTS borrowings (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),

    user_id CHAR(36) NOT NULL,
    borrowing_code VARCHAR(50) NOT NULL UNIQUE,

    borrowing_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date DATETIME NOT NULL,
    returned_at DATETIME,

    status ENUM(
        'pending',
        'approved',
        'rejected',
        'borrowed',
        'returned',
        'overdue',
        'cancelled'
    ) DEFAULT 'pending',

    notes TEXT,

    approved_by CHAR(36),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (approved_by)
        REFERENCES users(id)
        ON DELETE SET NULL
);

-- ============================================
-- 8. BORROWING ITEMS
-- Detail buku dalam transaksi
-- ============================================

CREATE TABLE IF NOT EXISTS borrowing_items (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),

    borrowing_id CHAR(36) NOT NULL,
    book_id CHAR(36) NOT NULL,

    quantity INT NOT NULL DEFAULT 1,
    returned_quantity INT NOT NULL DEFAULT 0,

    FOREIGN KEY (borrowing_id)
        REFERENCES borrowings(id)
        ON DELETE CASCADE,

    FOREIGN KEY (book_id)
        REFERENCES books(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_borrowing_quantity
        CHECK (
            quantity > 0
            AND returned_quantity >= 0
            AND returned_quantity <= quantity
        )
);

-- ============================================
-- 9. NOTIFICATIONS
-- ============================================

CREATE TABLE IF NOT EXISTS notifications (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),

    user_id CHAR(36) NOT NULL,

    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,

    type VARCHAR(50),
    reference_id CHAR(36),

    is_read BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- ============================================
-- 10. FAVORITES
-- ============================================

CREATE TABLE IF NOT EXISTS favorites (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),

    user_id CHAR(36) NOT NULL,
    book_id CHAR(36) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (book_id)
        REFERENCES books(id)
        ON DELETE CASCADE,
        
    UNIQUE (user_id, book_id)
);
