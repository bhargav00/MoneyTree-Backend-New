-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 09, 2017 at 12:17 PM
-- Server version: 10.1.21-MariaDB
-- PHP Version: 7.1.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `moneytree`
--

-- --------------------------------------------------------

--
-- Table structure for table `block`
--

CREATE TABLE `block` (
  `block_id` int(10) NOT NULL,
  `s_id` int(11) NOT NULL,
  `et_id` int(10) NOT NULL,
  `side` varchar(50) NOT NULL,
  `symbol` varchar(50) NOT NULL,
  `status` varchar(50) NOT NULL,
  `current_price` int(10) NOT NULL,
  `limit_price` int(11) DEFAULT NULL,
  `stop_price` int(11) DEFAULT NULL,
  `total_qty` int(10) NOT NULL,
  `executed_qty` int(10) NOT NULL,
  `open_qty` int(10) NOT NULL,
  `block_timestamp` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `block`
--

INSERT INTO `block` (`block_id`, `s_id`, `et_id`, `side`, `symbol`, `status`, `current_price`, `limit_price`, `stop_price`, `total_qty`, `executed_qty`, `open_qty`, `block_timestamp`) VALUES
(1, 1, 1, 'buy', 'NSE', 'open', 0, 200, 100, 100, 0, 200, '2017-03-22 06:03:00.000000'),
(2, 4, 2, 'buy', 'nse', 'open', 345, 3, 3, 333, 3, 3, '2017-03-08 18:30:00.000000'),
(3, 1, 1, 'buy', 'bse', 'open', 500, 0, 0, 1100, 0, 1100, '0000-00-00 00:00:00.000000'),
(4, 4, 1, 'buy', 'bse', 'open', 500, 0, 0, 5555, 0, 5555, '0000-00-00 00:00:00.000000'),
(5, 1, 1, 'buy', 'bse', 'open', 500, 0, 0, 1100, 0, 1100, '0000-00-00 00:00:00.000000'),
(6, 4, 1, 'buy', 'bse', 'open', 500, 0, 0, 5555, 0, 5555, '0000-00-00 00:00:00.000000'),
(7, 1, 1, 'buy', 'bse', 'open', 500, 0, 0, 1100, 0, 1100, '0000-00-00 00:00:00.000000'),
(8, 4, 1, 'buy', 'bse', 'open', 500, 0, 0, 5555, 0, 5555, '0000-00-00 00:00:00.000000'),
(9, 1, 1, 'buy', 'bse', 'open', 500, 0, 0, 1100, 0, 1100, '0000-00-00 00:00:00.000000'),
(10, 4, 1, 'buy', 'bse', 'open', 500, 0, 0, 5555, 0, 5555, '0000-00-00 00:00:00.000000');

-- --------------------------------------------------------

--
-- Table structure for table `equity_trader`
--

CREATE TABLE `equity_trader` (
  `et_id` int(10) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(200) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `equity_trader`
--

INSERT INTO `equity_trader` (`et_id`, `username`, `password`, `name`) VALUES
(1, 't1', 't1', 'Test'),
(2, 'test1', 'test', 'Bhargav'),
(3, 'test2', 'test', 'Rishabh'),
(4, 'test3', 'test', 'parth'),
(5, 'z', 'z', 'Keshav'),
(6, 'a', 'a', 'test'),
(7, '0', '0', '');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `side` varchar(50) NOT NULL,
  `symbol` varchar(11) NOT NULL,
  `total_qty` int(10) NOT NULL,
  `limit_price` int(11) DEFAULT NULL,
  `stop_price` int(11) DEFAULT NULL,
  `open_qty` int(10) NOT NULL,
  `allocated_qty` int(10) NOT NULL DEFAULT '0',
  `status` varchar(50) NOT NULL,
  `et_id` int(10) DEFAULT NULL,
  `pm_id` int(10) NOT NULL,
  `s_id` int(10) NOT NULL,
  `current_price` float NOT NULL,
  `order_timestamp` varchar(30) NOT NULL DEFAULT 'CURRENT_TIMESTAMP(6)'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='order details';

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `side`, `symbol`, `total_qty`, `limit_price`, `stop_price`, `open_qty`, `allocated_qty`, `status`, `et_id`, `pm_id`, `s_id`, `current_price`, `order_timestamp`) VALUES
(1, 'buy ', ' bse', 8676, 0, 0, 8676, 0, 'blocked', 1, 1, 6, 800, '3/9/2017, 4:12:27 PM'),
(2, 'buy ', ' bse', 2289, 0, 0, 2289, 0, 'accepted', 1, 1, 6, 800, '3/9/2017, 4:19:42 PM'),
(3, 'sell ', ' bse', 45, 0, 0, 45, 0, 'draft', 3, 1, 1, 500, '3/9/2017, 4:20:42 PM'),
(4, 'sell', 'bse', 55555555, 0, 0, 55555555, 0, 'accepted', 1, 1, 1, 500, '2017-03-09 16:33:36'),
(5, 'buy ', ' bse', 1334, 0, 0, 1334, 0, 'open', NULL, 1, 1, 500, '3/9/2017, 4:32:10 PM'),
(6, 'buy ', ' bse', 2, 0, 0, 2, 0, 'open', NULL, 1, 1, 500, '3/9/2017, 4:34:45 PM'),
(7, 'buy ', ' bse', 2, 0, 0, 2, 0, 'open', NULL, 1, 1, 500, '3/9/2017, 4:34:48 PM'),
(8, 'buy ', ' bse', 2, 0, 0, 2, 0, 'open', NULL, 1, 1, 500, '3/9/2017, 4:34:51 PM'),
(9, 'buy ', ' undefined', 3, 0, 0, 3, 0, 'open', NULL, 1, 1, 0, '3/9/2017, 4:42:41 PM'),
(10, 'buy ', ' bse', 99945, 0, 0, 99945, 0, 'open', 2, 1, 1, 500, '3/9/2017, 4:46:22 PM');

-- --------------------------------------------------------

--
-- Table structure for table `order_block`
--

CREATE TABLE `order_block` (
  `order_id` int(10) NOT NULL,
  `block_id` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `pm_et_relations`
--

CREATE TABLE `pm_et_relations` (
  `pm_id` int(10) NOT NULL,
  `et_id` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

--
-- Dumping data for table `pm_et_relations`
--

INSERT INTO `pm_et_relations` (`pm_id`, `et_id`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5);

-- --------------------------------------------------------

--
-- Table structure for table `portfolio_manager`
--

CREATE TABLE `portfolio_manager` (
  `pm_id` int(10) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(200) NOT NULL,
  `token` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  `cash_available` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `portfolio_manager`
--

INSERT INTO `portfolio_manager` (`pm_id`, `username`, `password`, `token`, `name`, `cash_available`) VALUES
(1, 'test_pm', 'test_pm', '4ba9a78c-dc9a-48de-8405-ee4eff341189', 'Test User', 0),
(2, 'a', 'a', 'efffb429-e052-42c6-8980-d1606cd07f5c', 'Test', 5000),
(3, 'b', 'b', '744b5365-8282-4863-9cf3-70de71117855', 'B', 120);

-- --------------------------------------------------------

--
-- Table structure for table `stock`
--

CREATE TABLE `stock` (
  `s_id` int(10) NOT NULL,
  `stock_name` varchar(30) NOT NULL,
  `price` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `stock`
--

INSERT INTO `stock` (`s_id`, `stock_name`, `price`) VALUES
(1, 'TCS', 500),
(3, 'Tata Steel', 410),
(4, 'Telecom', 850),
(5, 'Alibaba', 500),
(6, 'Tokyo', 800);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `block`
--
ALTER TABLE `block`
  ADD PRIMARY KEY (`block_id`);

--
-- Indexes for table `equity_trader`
--
ALTER TABLE `equity_trader`
  ADD PRIMARY KEY (`et_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`);

--
-- Indexes for table `order_block`
--
ALTER TABLE `order_block`
  ADD KEY `order_id` (`order_id`),
  ADD KEY `block_id` (`block_id`);

--
-- Indexes for table `pm_et_relations`
--
ALTER TABLE `pm_et_relations`
  ADD KEY `fk_pm_id` (`pm_id`),
  ADD KEY `fk_et_id` (`et_id`);

--
-- Indexes for table `portfolio_manager`
--
ALTER TABLE `portfolio_manager`
  ADD PRIMARY KEY (`pm_id`);

--
-- Indexes for table `stock`
--
ALTER TABLE `stock`
  ADD PRIMARY KEY (`s_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `block`
--
ALTER TABLE `block`
  MODIFY `block_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT for table `equity_trader`
--
ALTER TABLE `equity_trader`
  MODIFY `et_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT for table `portfolio_manager`
--
ALTER TABLE `portfolio_manager`
  MODIFY `pm_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `stock`
--
ALTER TABLE `stock`
  MODIFY `s_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
