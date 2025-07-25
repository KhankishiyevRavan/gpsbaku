import PageBreadcrumbSub from "../../components/common/PageBreadCrumbSub";
import PageMeta from "../../components/common/PageMeta";
import EditPackageForm from "../Forms/EditePackageForm";

export default function EditPackage() {
  return (
    <div>
      <PageMeta
        title="GPSBAKU.AZ | Form Elements Dashboard"
        description="This is GPSBAKU.AZ Form Elements Dashboard page"
      />
      <PageBreadcrumbSub
        pageTitle="Paketlər siyahısı"
        modelName="Xidmət paketləri"
        subTitle="Xidmət paketi əlavə et"
        pageTitleSrc="/packages"
      />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6">
          <EditPackageForm />
        </div>
      </div>
    </div>
  );
}
