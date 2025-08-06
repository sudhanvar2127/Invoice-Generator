import Gst from "../Components/Gst";
import Seller from "../Components/Seller";
import BuyerandConsignee from "../Components/BuyerandConsignee";
import OtherDetails from "../Components/OtherDetails";
import AddItems from "./AddItems";

export const StepOne = () => <div>
    <Gst />
      <div className="flex">
        <div className="flex flex-col w-1/2 border p-6 space-y-6">
          <Seller />
          <BuyerandConsignee />
        </div>

        <div className="flex flex-col w-1/2 border border-l-0 p-6">
          <OtherDetails />
        </div>
      </div>
</div>;

export const StepTwo = () => <div>
    <AddItems />
</div>;
