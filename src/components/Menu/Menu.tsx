import {
  IonContent,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
  useIonRouter,
} from "@ionic/react";
import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  businessOutline,
  homeOutline,
  paperPlaneOutline,
  peopleOutline,
} from "ionicons/icons";
import { AuthContext } from "../../context/authContext";
import { readCookieItems } from "../../utils/cookieFunctions";
import { getAllData, getDataById } from "../../firebase/firestoreService";
import "./Menu.css";

interface AppPage {
  title: string;
  url: string;
  iosIcon: string;
  mdIcon: string;
  subMenuItems?: SubMenu[];
}

interface SubMenu {
  title: string;
  url1: string;
  url2?: string;
  url3?: string;
  url4?: string;
}

const initialAppPages: AppPage[] = [
  {
    title: "",
    url: "",
    iosIcon: "",
    mdIcon: "",
  },
];

const PREVENT_SHOW_SIDEBAR = ["/login"];

const Menu: React.FC = () => {
  const [isSubMenuVisible, setIsSubMenuVisible] = useState(false);
  const [subMenuItems, setSubMenuItems] = useState<SubMenu[]>([]);
  const [appPages, setAppPages] = useState<AppPage[]>();
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();
  const router = useIonRouter();

  const userMenu: AppPage[] = [
    {
      title: "Dashboard",
      url: "/dashboard",
      iosIcon: homeOutline,
      mdIcon: homeOutline,
    },
    {
      title: "News",
      url: "/news",
      iosIcon: paperPlaneOutline,
      mdIcon: paperPlaneOutline,
    },
    {
      title: "Organization List",
      url: "/organizations",
      iosIcon: businessOutline,
      mdIcon: businessOutline,
    },
    {
      title: "My Organization",
      url: "/my-organization",
      iosIcon: peopleOutline,
      mdIcon: peopleOutline,
      subMenuItems: subMenuItems,
    },
  ];

  const adminMenu: AppPage[] = [
    {
      title: "Dashboard",
      url: "/dashboard",
      iosIcon: homeOutline,
      mdIcon: homeOutline,
    },
    {
      title: "News",
      url: "/news",
      iosIcon: paperPlaneOutline,
      mdIcon: paperPlaneOutline,
    },
    {
      title: "Organization List",
      url: "/organizations",
      iosIcon: businessOutline,
      mdIcon: businessOutline,
    },
    {
      title: "Users",
      url: "/users",
      iosIcon: peopleOutline,
      mdIcon: peopleOutline,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setAppPages(initialAppPages);
      setSubMenuItems([]);

      const user = readCookieItems("user");
      if (user) {
        const userData = await getDataById(user.uid, "users");

        if (userData?.role === 1) {
          setAppPages(adminMenu);
        } else {
          setAppPages(userMenu);
          const organizationPromises = userData?.organizations.map(
            async (organization: Record<string, string>) => {
              const organizationData = await getDataById(
                organization.id,
                "organizations"
              );
              return {
                title: organizationData?.name,
                url1: `/my-organization/${organizationData?.id}/events`,
                url2: `/my-organization/${organizationData?.id}/members`,
                url3: `/my-organization/${organizationData?.id}/gallery`,
                url4: `/my-organization/${organizationData?.id}/achievements`,
              };
            }
          );
          const myOrganizationSubMenu = await Promise.all(organizationPromises);
          setSubMenuItems(myOrganizationSubMenu);
        }
      }
    };

    fetchData();
  }, [currentUser]);

  useEffect(() => {
    if (subMenuItems.length > 0) {
      const updatedUserMenu = userMenu.map((menuItem) => {
        if (menuItem.title === "My Organization") {
          return { ...menuItem, subMenuItems: subMenuItems };
        }
        return menuItem;
      });
      setAppPages(updatedUserMenu);
    }
  }, [subMenuItems]);

  const toggleSubMenuVisibility = () => {
    setIsSubMenuVisible(!isSubMenuVisible);
  };

  const isPathSubItem = (subMenuItem: SubMenu) => {
    if (
      location.pathname === subMenuItem.url1 ||
      location.pathname === subMenuItem.url2 ||
      location.pathname === subMenuItem.url3 ||
      location.pathname === subMenuItem.url4
    ) {
      return true;
    }

    return false;
  };

  return (
    <IonMenu
      contentId="main"
      type="overlay"
      disabled={PREVENT_SHOW_SIDEBAR.includes(router.routeInfo.pathname)}
    >
      <IonContent>
        <IonList id="inbox-list">
          <IonImg src="src/assets/images/logo-unhas.png"></IonImg>
          {appPages?.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                {appPage.title === "" ? (
                  <></>
                ) : appPage.title === "My Organization" ? (
                  <>
                    <IonItem
                      className={
                        location.pathname === appPage.url ? "selected" : ""
                      }
                      onClick={toggleSubMenuVisibility}
                      lines="none"
                    >
                      <IonIcon
                        aria-hidden="true"
                        slot="start"
                        ios={appPage.iosIcon}
                        md={appPage.mdIcon}
                      />
                      <IonLabel>{appPage.title}</IonLabel>
                    </IonItem>
                    {isSubMenuVisible &&
                      appPage.subMenuItems &&
                      appPage.subMenuItems.map((subMenuItem, subIndex) => (
                        <IonItem
                          key={subIndex}
                          className={
                            isPathSubItem(subMenuItem) ? "selected" : ""
                          }
                          routerLink={subMenuItem.url1}
                          routerDirection="none"
                          lines="none"
                          detail={false}
                        >
                          <IonIcon aria-hidden="true" slot="start" />
                          <IonLabel>{subMenuItem.title}</IonLabel>
                        </IonItem>
                      ))}
                  </>
                ) : (
                  <IonItem
                    className={
                      location.pathname === appPage.url ? "selected" : ""
                    }
                    routerLink={appPage.url}
                    routerDirection="none"
                    lines="none"
                    detail={false}
                  >
                    <IonIcon
                      aria-hidden="true"
                      slot="start"
                      ios={appPage.iosIcon}
                      md={appPage.mdIcon}
                    />
                    <IonLabel>{appPage.title}</IonLabel>
                  </IonItem>
                )}
              </IonMenuToggle>
            );
          })}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
