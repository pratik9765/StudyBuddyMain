const mongoose = require("mongoose");
const Category = require("../models/Category");
require("dotenv").config();

const RETRY_DELAY_MS = 5000;

const DEFAULT_CATEGORIES = [
	{
		name: "Web Development",
		description: "Frontend, backend, and full-stack web development courses.",
	},
	{
		name: "Data Science",
		description: "Data analysis, visualization, statistics, and machine learning.",
	},
	{
		name: "Python",
		description: "Python programming courses for beginner through advanced learners.",
	},
	{
		name: "Computer Science",
		description: "Programming fundamentals, algorithms, and core computing concepts.",
	},
	{
		name: "Design",
		description: "UI, UX, graphic design, and creative tools.",
	},
	{
		name: "Business",
		description: "Business, entrepreneurship, marketing, and management.",
	},
];

const seedDefaultCategories = async () => {
	const categoryCount = await Category.countDocuments();

	if (categoryCount > 0) {
		return;
	}

	await Category.insertMany(DEFAULT_CATEGORIES);
	console.log(`Created ${DEFAULT_CATEGORIES.length} default course categories`);
};

exports.connect = async () => {
	const { MONGODB_URL } = process.env;

	if (!MONGODB_URL) {
		console.error("MONGODB_URL is missing in server/.env");
		return;
	}

	try {
		await mongoose.connect(MONGODB_URL, {
			serverSelectionTimeoutMS: 5000,
		});
		console.log("DB Connection Successful");
		await seedDefaultCategories();
	} catch (error) {
		console.error(`DB Connection Failed: ${error.message}`);
		console.error(`Retrying MongoDB connection in ${RETRY_DELAY_MS / 1000}s...`);
		setTimeout(exports.connect, RETRY_DELAY_MS);
	}
};
