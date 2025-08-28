import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageBreadcrumbSub from "../../components/common/PageBreadCrumbSub";
import PageMeta from "../../components/common/PageMeta";
import CallTypeSelector from "../Forms/Call/CallTypeSelector";

export default function CallType() {
  return (
    <div>
      <PageMeta
        title="GPSBAKU.AZ | Form Elements Dashboard"
        description="This is GPSBAKU.AZ Form Elements Dashboard page"
      />
      <PageBreadcrumbSub
        pageTitle="Çağırışlar"
        modelName="Çağırış xidmətləri"
        pageTitleSrc="/calls"
        subTitle="Çağırış növü seçin"
      />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6">
          <ComponentCard title={``}>
            <CallTypeSelector />
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}
