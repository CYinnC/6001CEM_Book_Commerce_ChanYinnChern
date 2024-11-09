-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 08, 2024 at 12:20 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `users`
--

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `author` varchar(200) NOT NULL,
  `condition` varchar(200) NOT NULL,
  `description` varchar(500) NOT NULL,
  `image` varchar(200) NOT NULL,
  `type` varchar(200) NOT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp(),
  `recommended` varchar(20) DEFAULT 'default',
  `genres` enum('fictional','nonfictional','educational') NOT NULL DEFAULT 'fictional'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`id`, `user_id`, `title`, `author`, `condition`, `description`, `image`, `type`, `price`, `time`, `recommended`, `genres`) VALUES
(17, 12, 'Sun Tzu The Art of War', 'Sun Tzu', 'Good Condition', 'Sun Tzu The Art of War, book is in good condition and have been properly maintained ', 'uploads\\1729942029582.png', 'selling', 40.00, '2024-10-26 11:27:09', 'default', 'nonfictional'),
(18, 12, 'DIFFERENT WINTER', 'Mia Jackson', 'Ok Condition', 'Different winter by Mia Jackson, book is in an ok condition but there are some creases on some of the pages. ', 'uploads\\1729942419837.jpg', 'trading', 0.00, '2024-10-26 11:33:39', 'default', 'fictional'),
(19, 12, 'The Lord of The Rings The Fellowship of The Ring', 'J.R.R.Tolkien', 'Good Condition ', 'The Lord of The Rings The Fellowship of The Ring, The book is in good condition and have been taken cared of.', 'uploads\\1729942583598.jpg', 'selling', 30.50, '2024-10-26 11:36:23', 'default', 'fictional'),
(20, 2, 'The Scarlet Letter', 'Nathaniel Hawthrone', 'ok condition', 'The book is in an ok condition but got a few pages that have been folded and cover is worn out by a bit.', 'uploads\\1729942754433.jpg', 'trading', 0.00, '2024-10-26 11:39:14', 'default', 'fictional'),
(21, 3, 'Percy Jackson and The Lightning Thief ', 'Rick Riordan', 'Excellent condition', 'The book has been properly maintained and have no creases.', 'uploads\\1729943240959.jpg', 'selling', 30.00, '2024-10-26 11:47:20', 'default', 'fictional'),
(22, 3, 'Percy Jackson and The Titan\'s Curse', 'Rick Riordan', 'Excellent condition', 'The book has been properly maintained and have no signs of wear and tear.', 'uploads\\1729943348516.jpg', 'selling', 30.00, '2024-10-26 11:49:08', 'default', 'fictional'),
(23, 3, 'Percy Jackson and The Last Olympian', 'Rick Riordan', 'Excellent condition', 'the book has been properly maintained and have no signs of wear and tear.', 'uploads\\1729943433828.png', 'selling', 30.00, '2024-10-26 11:50:33', 'recommended', 'fictional'),
(24, 4, 'Harry Potter and The Philosopher\'s Stone ', 'J.K. Rowling ', 'good condition', 'The book is in good condition but there are a few pages that are folded, would trade for any math book of highschool level.', 'uploads\\1729943688035.png', 'trading', 0.00, '2024-10-26 11:54:48', 'default', 'fictional'),
(25, 4, 'Harry Potter and The Deathly Hallows', 'J.K. Rowling ', 'good condition', 'The book is in relativity good condition but there are some folds on some pages of the book ', 'uploads\\1729943869924.png', 'selling', 40.00, '2024-10-26 11:57:49', 'default', 'fictional'),
(26, 4, 'Harry Potter and The Prisoner of Azkaban ', 'J.K. Rowling ', 'good condition', 'The book is in good condition but have some folds on some of the pages. ', 'uploads\\1729943964968.png', 'selling', 40.00, '2024-10-26 11:59:24', 'default', 'fictional'),
(27, 4, 'Harry Potter and The Goblet of Fire', 'J.K. Rowling ', 'bad condition', 'The book is in a bad condition but is still usable, handling it with care is advise. ', 'uploads\\1729944065679.png', 'selling', 20.00, '2024-10-26 12:01:05', 'recommended', 'fictional'),
(53, 2, 'McDougal Littell Algebra 1 Concepts and Skills', 'Larson Boswell, Kanold Stiff', 'good condition', 'the book is in good condition and was not used there are no signs of fold or damage that can be found on the book.', 'uploads\\1730878576472.png', 'selling', 30.00, '2024-11-06 07:36:16', 'default', 'educational'),
(54, 2, 'BIG IDEAS MATH Algebra 1 ', 'Ron Larson, Laurie Baswell', 'good condition', 'Big Idea Math Algebra 1,the book have never been used and is top quality condition.', 'uploads\\1730878715860.png', 'selling', 30.00, '2024-11-06 07:38:35', 'default', 'educational');

-- --------------------------------------------------------

--
-- Table structure for table `complaints`
--

CREATE TABLE `complaints` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `issue_type` enum('product quality','scam','site issue','payment issue') NOT NULL,
  `detail` varchar(255) DEFAULT NULL,
  `created_time` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `complaints`
--

INSERT INTO `complaints` (`id`, `username`, `email`, `issue_type`, `detail`, `created_time`) VALUES
(4, 'jame', 'jm@gmail.com', 'scam', 'I have made a purchase to the seller Tom ID 4 for the book Harry Potter and The Deathly Hallows but i haven receive the book yet and would like to report a scam', '2024-11-06 14:29:11');

-- --------------------------------------------------------

--
-- Table structure for table `purchases`
--

CREATE TABLE `purchases` (
  `id` int(11) NOT NULL,
  `book_id` int(11) DEFAULT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  `shipping_address` varchar(200) DEFAULT NULL,
  `buyer_id` int(11) DEFAULT NULL,
  `seller_id` int(11) DEFAULT NULL,
  `status` enum('pending','accepted') DEFAULT 'pending',
  `created_time` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `purchases`
--

INSERT INTO `purchases` (`id`, `book_id`, `phone_number`, `shipping_address`, `buyer_id`, `seller_id`, `status`, `created_time`) VALUES
(1, 25, '01234567', '4 Jalan ZYX 100100 ZYZ', 2, 4, 'accepted', '2024-11-01 13:27:22'),
(2, 26, '0123456', 'bfbbgfbgngnnf', 2, 4, 'accepted', '2024-11-03 12:21:27');

-- --------------------------------------------------------

--
-- Table structure for table `trades`
--

CREATE TABLE `trades` (
  `id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `phone_number` varchar(200) DEFAULT NULL,
  `meet_up_location` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `book_condition` varchar(50) DEFAULT NULL,
  `description` varchar(300) DEFAULT NULL,
  `buyer_id` int(11) NOT NULL,
  `seller_id` int(11) NOT NULL,
  `status` enum('pending','accepted') NOT NULL,
  `created_time` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `trades`
--

INSERT INTO `trades` (`id`, `book_id`, `phone_number`, `meet_up_location`, `title`, `book_condition`, `description`, `buyer_id`, `seller_id`, `status`, `created_time`) VALUES
(4, 20, '01234566', '5 Jalan ABC 100100 ABC', 'Dr Jekyll and Mr Hyde', 'good condition', 'the book is in good condition and have no signs of folds', 3, 2, 'accepted', '2024-10-28 10:13:53');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(150) NOT NULL,
  `role` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`) VALUES
(1, 'Kevin', 'cc4bc25b37d1040714778d80b888d3169a1652932b8603cc2be5c014cfa85301', '83353fc5a8fdb345a327b9cd55d88302fc7daec0026bc432025e0eef6944e7de', 'admin'),
(2, 'jame', 'fc6ce77ee2c44aa489b4a0651bf07e9f0cd8a48c968babf21bd1d8c9fc927134', 'ece15ad6273f5bed954f2e391dd5f0b30f9aa99d1c99e081c96c260d44d6f59f', 'user'),
(3, 'frank', '8d085cf82cdb3c99f44af48f2e99f0e2ef518e91b3cf30012949c044206d95b1', '2e51672858831d330326f5bbd72a42848314e6d6a35b5b75670b1e602fa04f3d', 'user'),
(4, 'Tom', 'e487dada161e770a692f92774346997b3b83a15fe61a8ff8bb754245fb2032e5', 'bf91df79a0c1db76d19817bf00d30631981b7d11bfb85a821e6527e62542c801', 'user'),
(12, 'Average Joe', '62b1ab5bc982e80ecf47618d6c3e96368906bbcd6bf3c82b0d872ba80329e363', '6770928359445e82d7785c6372ec6f076b49c88bf84e2bff9cf998fe3b1e32a1', 'user'),
(13, 'Jake', '05f8caa20905b4490e8deb725f12394488a2f067c4ca7166123bf3a9d37fd80b', '9fa5fb7f1c71ab6926a29cc75ff86b325eae25d1fc328a74c3e651403fce80d4', 'admin'),
(16, 'Jay', '5ff2d0de9307653f88b52cdde128b369bbbe041cbf134b000f465776c5733eba', 'bdac857dfb500a0791bd7cd72a8ad260b9a3db09ce8f9de1285f2dbd3412e874', 'user'),
(22, 'Jan', '1bc2a81e40ba57c08c1f65b396aaee56ceb1c895eac81392933d899ddd506bed', '9fa5fb7f1c71ab6926a29cc75ff86b325eae25d1fc328a74c3e651403fce80d4', 'user');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`id`),
  ADD KEY `link` (`user_id`);

--
-- Indexes for table `complaints`
--
ALTER TABLE `complaints`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `purchases`
--
ALTER TABLE `purchases`
  ADD PRIMARY KEY (`id`),
  ADD KEY `book_id` (`book_id`),
  ADD KEY `buyer_id` (`buyer_id`),
  ADD KEY `seller_id` (`seller_id`);

--
-- Indexes for table `trades`
--
ALTER TABLE `trades`
  ADD PRIMARY KEY (`id`),
  ADD KEY `book_id` (`book_id`),
  ADD KEY `buyer_id` (`buyer_id`),
  ADD KEY `seller_id` (`seller_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `books`
--
ALTER TABLE `books`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT for table `complaints`
--
ALTER TABLE `complaints`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `purchases`
--
ALTER TABLE `purchases`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `trades`
--
ALTER TABLE `trades`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `books`
--
ALTER TABLE `books`
  ADD CONSTRAINT `link` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `purchases`
--
ALTER TABLE `purchases`
  ADD CONSTRAINT `purchases_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`),
  ADD CONSTRAINT `purchases_ibfk_2` FOREIGN KEY (`buyer_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `purchases_ibfk_3` FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `trades`
--
ALTER TABLE `trades`
  ADD CONSTRAINT `trades_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`),
  ADD CONSTRAINT `trades_ibfk_2` FOREIGN KEY (`buyer_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `trades_ibfk_3` FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
