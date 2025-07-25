import { useParams } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import BalanceTopUpForm from "../../components/form/BalanceTopUpForm";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumbSub from "../../components/common/PageBreadCrumbSub";

export default function BalanceTopUp() {
  const { id } = useParams();
  return (
    <div>
      <PageMeta
        title="GPSBAKU.AZ | Form Elements Dashboard"
        description="This is GPSBAKU.AZ Form Elements Dashboard page"
      />
      <PageBreadcrumbSub
        modelName="Ödəniş xidmətləri"
        pageTitle={`Ödənişlər`}
        subTitle="İstifadəçi balans artırılması"
        subTwoTitle="Balans əlavə et"
        subTwoTitleSrc="/add-balance"
        pageTitleSrc="/sales"
      />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <div className="space-y-6">
          <ComponentCard
          // title={`Balans əlavə etmə formu`}
          >
            <BalanceTopUpForm
              userId={String(id)}
              onSuccess={(newBalance) =>
                console.log("Yeni balans:", newBalance)
              }
            />
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}
