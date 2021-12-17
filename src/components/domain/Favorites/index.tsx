import React, { useEffect, useState } from "react";
import Spacer from "@components/base/Spacer";
import Link from "next/link";
import { NextPage } from "next";
import styled from "@emotion/styled";
import { Button, Icon, Image, Text } from "@components/base";
import { useNavigationContext } from "@contexts/hooks";
import favoriteAPI from "@service/favoriteApi";
import CourtItem from "../CourtItem";

declare global {
  interface Window {
    Kakao: any;
  }
}

const Favorites: NextPage = () => {
  const { useMountPage } = useNavigationContext();
  useMountPage((page) => page.FAVORITES);

  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined" && !window.Kakao.isInitialized()) {
      window.Kakao.init("c6f32516ffb011a356a9f8ea036ca21f"); // TODO env 파일로 바꾸기
    }
  }, []);

  const getPageFavorites = async () => {
    const { favorites } = await favoriteAPI.getMyFavorites();
    setFavorites(favorites);
    setIsLoading(false);
  };

  useEffect(() => {
    getPageFavorites();
  }, []);

  if (isLoading) {
    return <>Loading</>;
  }

  if (favorites.length === 0) {
    return (
      <WrapperSpacer gap="base" type="vertical">
        <Image
          width={200}
          height={200}
          mode="contain"
          src="assets/basketball/animation_off_400.png"
        />
        <Text size="md">즐겨찾는 농구장이 없으시네요? 🤔</Text>
        <TextGray size="xs">
          농구장을 즐겨찾기하시면 더 빠르게 예약하실 수 있어요
        </TextGray>
        <Link href="/courts" passHref>
          <SearchButton fullWidth>
            <SearchIcon name="compass" size="sm" color="white"></SearchIcon>내
            주변 농구장 찾기
          </SearchButton>
        </Link>
      </WrapperSpacer>
    );
  }

  return (
    <Spacer gap="base" type="vertical">
      {favorites.map(
        ({ favoriteId, courtName, courtId, latitude, longitude }) => (
          <FavoriteItem key={favoriteId}>
            <Spacer gap="xs" type="vertical">
              <CourtItem.Header>{courtName}</CourtItem.Header>
              <CourtItem.Address>{"주소 넣기"}</CourtItem.Address>
            </Spacer>

            <Actions gap="xs">
              <CourtItem.FavoritesToggle courtId={courtId} />
              <CourtItem.ShareButton />
              <CourtItem.ChatLink courtId={courtId} />
              <CourtItem.KakaoMapLink
                latitude={latitude}
                longitude={longitude}
                courtName={courtName}
              />
              <Link href="/" passHref>
                <Button size="lg" style={{ flex: 1 }}>
                  예약하기
                </Button>
              </Link>
            </Actions>
          </FavoriteItem>
        )
      )}
    </Spacer>
  );
};

const Actions = styled(Spacer)`
  margin-top: 40px;
`;

const FavoriteItem = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadiuses.lg};
  padding: 20px;
`;

const TextGray = styled(Text)`
  color: ${({ theme }) => theme.colors.gray500};
`;

const SearchButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SearchIcon = styled(Icon)`
  margin-right: 5px;
`;

const WrapperSpacer = styled(Spacer)`
  align-items: center;
`;
export default Favorites;
