import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageBreadcrumbSub from "../../components/common/PageBreadCrumbSub";
import PageMeta from "../../components/common/PageMeta";
import EditUserDataForm from "../Forms/EditUserDataForm";

export default function EditDataUser() {
  return (
    <div>
      <PageMeta
        title="GPSBAKU.AZ | İstifadəçini yeniləmə"
        description="Bu GPSBAKU.AZ-ın istifadəçini yeniləmə formudur."
      />
      <PageBreadcrumbSub
        pageTitle="İstifadəçi siyahısı"
        modelName="İstifadəçilər"
        subTitle="İstifadəçini redaktə etmə"
        pageTitleSrc="/list"
      />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6">
          <EditUserDataForm />
        </div>
      </div>
    </div>
  );
}
