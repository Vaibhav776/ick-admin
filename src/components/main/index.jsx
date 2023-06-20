import React from "react";

import { Switch, Route } from "react-router-dom";

import AddProduct from "../addProduct";
import UpcomingCar from "../addUpcomingCar";
import AddUpcomingCar from "../addUpcomingCar/AddUpcomingPage";
import AddImage from "../addImages";
import Dashboard from "../dashboard";

//common
import SideBar from "../../common/components/sidebar";
import Navbar from "../../common/components/navbar";
import AddPrices from "../addPrice";
import Import_Info from "../import_information.js/import_info";
import Features from "../features";
import News from "../news";
import QuestionsAnswers from "../QuestionsAnswers";
import AddNews from "../news/addNews";
import Models from "../models";
import AddComparisons from "../comparisons/Add Comparison";
import Comparisons from "../comparisons";
import AddSlider from "../addSlider";
import Brands from "../brands";
import Variants from "../variants";
import Reviews from "../reviews";
import EditBrand from "../brands/EditBrand";
import EditModel from "../models/EditModel";
import EditVariant from "../variants/EditVariants";
import EditSlider from "../addSlider/EditSlider";
import AddQuestion from "../QuestionsAnswers/AddQuestion";
import AdminReviews from "../adminReviews";
import AddReview from "../adminReviews/AddReview";
import EditNews from "../news/editNews";
import Seo from "../seo";
import EditReviews from '../adminReviews/AddReview/EditReview'
function Main(props) {
	return (
		<div className="wrapper">
			<SideBar />
			<div className="main-panel">
				<Navbar {...props} />
				<Switch>
					{
						<>
							<Route exact path="/" component={Dashboard} />
							<Route exact path="/brands" component={Brands} />
							<Route
								exact
								path="/brands/:brandName"
								component={EditBrand}
							/>
							<Route
								exact
								path="/variants"
								component={Variants}
							/>
							<Route
								exact
								path="/variants/:modelId/:variantId"
								component={EditVariant}
							/>
							<Route
								exact
								path="/user_reviews"
								component={Reviews}
							/>
							<Route
								exact
								path="/admin_reviews"
								component={AdminReviews}
							/>
							<Route 
								exact
								path="/edit_reviews"
								component={EditReviews}
							/>
							<Route
								exact
								path="/add_review"
								component={AddReview}
							/>
							<Route path="/add_product" component={AddProduct} />
							<Route
								path="/upcoming_cars"
								component={UpcomingCar}
							/>
							<Route
								path="/add_upcoming_car"
								component={AddUpcomingCar}
							/>
							<Route path="/add_slider" component={AddSlider} />
							<Route
								path="/slider/:sliderId"
								component={EditSlider}
							/>
							<Route exact path="/models" component={Models} />
							<Route
								exact
								path="/models/:modelName"
								component={EditModel}
							/>
							<Route
								path="/comparisons"
								component={Comparisons}
							/>
							<Route
								path="/add_comparison"
								component={AddComparisons}
							/>
							<Route
								exact
								path="/news_edit"
								component={News}
							/>
							<Route
							path="/edit_news"
							component={EditNews}
							/>
							<Route path="/images" component={AddImage} />
							<Route path="/prices" component={AddPrices} />
							<Route path="/features" component={Features} />
							<Route path="/news" component={News} />
							<Route
								path="/qa_panel"
								component={QuestionsAnswers}
							/>
							<Route path="/add_qa" component={AddQuestion} />
							<Route path="/create_news" component={AddNews} />
							<Route
								path="/import_files"
								component={Import_Info}
							/>
							<Route
								path="/seo"
								component={Seo}
							/>
						</>
					}
				</Switch>
				{/* <Footer /> */}
			</div>
		</div>
	);
}

export default Main;
