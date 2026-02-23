import '../../../components/philanthropy-&-impact/PhilanthropyPage.css';
import PhHero    from '../../../components/philanthropy-&-impact/PhHero';
import PhMountain from '../../../components/philanthropy-&-impact/PhMountain';
import { PhVision, PhMap, PhImpact, PhCTA } from '../../../components/philanthropy-&-impact/PhSections';

export default function PhilanthropyImpact() {
    return (
        <div className="ph-page">
            <PhHero />
            <PhMountain />
            <PhVision />
            <PhMap />
            <PhImpact />
            <PhCTA />
        </div>
    );
}

