import React from "react";
import {
	Chart as ChartJS,
	CategoryScale,
	BarElement,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	RadialLinearScale,
	ArcElement,
} from "chart.js";
import {Bar, PolarArea, Line} from 'react-chartjs-2';

ChartJS.register(
	CategoryScale,
	RadialLinearScale,
	ArcElement,
	BarElement,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
);

export default function Dashboard() {

	const data = [
		{
			heading: "Total Sales",
			title: "1,45,000",
			icon: "nc-icon nc-globe text-warning",
			subHeading: "Update Now",
		},
		{
			heading: "Revenue",
			title: "1,22,000",
			icon: "nc-icon nc-money-coins text-success",
			subHeading: "Last day",
		},
		{
			heading: "Brands",
			title: "23",
			icon: "nc-icon nc-bold text-danger",
			subHeading: "In the last hour",
		},
		{
			heading: "Models",
			title: "43",
			icon: "fa fa-car text-primary",
			subHeading: "Update now",
		},
		{
			heading: "Variants",
			title: "22",
			icon: "fa fa-car text-warning",
			subHeading: "Update Now",
		},
		{
			heading: "Users",
			title: "2000",
			icon: "nc-icon nc-single-02 text-success",
			subHeading: "Last day",
		},
		{
			heading: "Images",
			title: "200",
			icon: "nc-icon nc-album-2 text-danger",
			subHeading: "In the last hour",
		},
		{
			heading: "Videos",
			title: "250",
			icon: "nc-icon nc-button-play text-primary",
			subHeading: "Update now",
		},
	];

	const state = {
		labels: ["January", "February", "March", "April", "May"],
		datasets: [
			{
				label: "Rainfall",
				backgroundColor: "rgba(75,192,192,1)",
				borderColor: "rgba(0,0,0,1)",
				borderWidth: 2,
				data: [65, 59, 80, 81, 56],
			},
		],
	};

	console.log(state);

	return (
		<div className="content">
			<div className="row">
				{data?.map((d, index) => (
					<div key={index} className="col-lg-3 col-md-6 col-sm-6">
						<div className="card card-stats">
							<div className="card-body ">
								<div className="row">
									<div className="col-5 col-md-4">
										<div className="icon-big text-center icon-warning">
											<i className={d.icon}></i>
										</div>
									</div>
									<div className="col-7 col-md-8">
										<div className="numbers">
											<p className="card-category">
												{d.heading}
											</p>
											<p className="card-title">
												{d.title}
											</p>
										</div>
									</div>
								</div>
							</div>
							<div className="card-footer ">
								<hr />
								<div className="stats">
									<i className={d.icon}></i>
									{d.subHeading}
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
			<div className="row">
				<div className="col-md-12">
					<div className="card ">
						<div className="card-header ">
							<h5 className="card-title">Users Behavior</h5>
							<p className="card-category">
								24 Hours performance
							</p>
						</div>
						<div className="card-body ">
							<Bar
								data={state}
								options={{
									title: {
										display: true,
										text: "Average Rainfall per month",
										fontSize: 20,
									},
									legend: {
										display: true,
										position: "right",
									},
								}}
							/>
						</div>
						<div className="card-footer ">
							<hr />
							<div className="stats">
								<i className="fa fa-history"></i> Updated 3
								minutes ago
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col-md-4">
					<div className="card ">
						<div className="card-header ">
							<h5 className="card-title">Email Statistics</h5>
							<p className="card-category">
								Last Campaign Performance
							</p>
						</div>
						<div className="card-body ">
							<PolarArea data={state}/>
						</div>
						<div className="card-footer ">
							<div className="legend">
								<i className="fa fa-circle text-primary"></i>{" "}
								Opened
								<i className="fa fa-circle text-warning"></i>{" "}
								Read
								<i className="fa fa-circle text-danger"></i>{" "}
								Deleted
								<i className="fa fa-circle text-gray"></i>{" "}
								Unopened
							</div>
							<hr />
							<div className="stats">
								<i className="fa fa-calendar"></i> Number of
								emails sent
							</div>
						</div>
					</div>
				</div>
				<div className="col-md-8">
					<div className="card card-chart">
						<div className="card-header">
							<h5 className="card-title">NASDAQ: AAPL</h5>
							<p className="card-category">
								Line Chart with Points
							</p>
						</div>
						<div className="card-body">
							{/* <canvas
								id="speedChart"
								width="400"
								height="100"></canvas> */}
							<Line data={state}/>
						</div>
						<div className="card-footer">
							<div className="chart-legend">
								<i className="fa fa-circle text-info"></i> Tesla
								Model S
								<i className="fa fa-circle text-warning"></i>{" "}
								BMW 5 Series
							</div>
							<hr />
							<div className="card-stats">
								<i className="fa fa-check"></i> Data information
								certified
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
