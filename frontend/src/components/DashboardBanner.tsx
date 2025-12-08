import bannerImg from '../assets/banner.png';

export function DashboardBanner() {
    return (
        <div className="w-full mb-6 rounded-xl overflow-hidden shadow-sm border border-orange-100">
            <img
                src={bannerImg}
                alt="PM-AJAY Dashboard Banner"
                className="w-full h-32 md:h-48 object-cover"
            />
        </div>
    );
}
