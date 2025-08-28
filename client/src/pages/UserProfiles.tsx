import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import UserAddressCard from "../components/UserProfile/UserAddressCard";
import PageMeta from "../components/common/PageMeta";
import { useEffect, useState } from "react";
import { getUser, userDataInterface } from "../services/userService";
import { useParams } from "react-router";
import UserContractCard from "../components/UserProfile/UserContractCard";
import PageBreadcrumbSub from "../components/common/PageBreadCrumbSub";

export default function UserProfiles() {
  const { id } = useParams();
  const [user, setUser] = useState<userDataInterface | null>(null);
  const fetchUser = async () => {
    if (!id) return;
    try {
      let data = await getUser(id);
      console.log(data);
      setUser(data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <>
      <PageMeta
        title="GPSBAKU.AZ | Profile Dashboard"
        description="This is GPSBAKU.AZ Profile Dashboard page"
      />
      <PageBreadcrumbSub pageTitle="İstifadəçilər" subTitle="İstifadəçi" pageTitleSrc="/list"/>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        {/* <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
        </h3> */}
        <div className="space-y-6">
          {id && <UserMetaCard user={user} id={id} />}
          <UserInfoCard user={user} />
          {/* {user?.address && <UserAddressCard user={user} />} */}
          {id && user?.roleName=="abuneci" && <UserContractCard id={id} />}
        </div>
      </div>
    </>
  );
}
