import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageBreadcrumbSub from "../../components/common/PageBreadCrumbSub";
import PageMeta from "../../components/common/PageMeta";
// import EditRoleForm from "../Forms/EditRoleForm";
import UpdateContractForm from "../Forms/UpdateContractForm";

export default function UpdateContract() {
  return (
    <div>
      <PageMeta
        title="GPSBAKU.AZ | Form Elements Dashboard"
        description="This is GPSBAKU.AZ Form Elements Dashboard page"
      />
      <PageBreadcrumbSub
        subTitle="Müqavilə redaktə etmə"
        modelName="Müqavilələr"
        pageTitle="Müqavilə siyahısı"
        pageTitleSrc="/contracts"
      />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6">
          <UpdateContractForm />
        </div>
      </div>
    </div>
  );
}
