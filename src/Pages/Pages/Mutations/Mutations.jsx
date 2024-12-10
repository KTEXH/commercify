import { gql } from "@apollo/client";


export const CREATE_LINK_IN_BIO = gql`
  mutation CreateLinkinbio(
    $backgroundColor: String
    $font: String
    $mediaColor: String
    $textColor: String
    $iconColor: String
    $isBackground: Boolean
    $template: Int
    $subdomain: String
    $background: String
    $borderRadius: String
    $backdrop: Boolean
    $backdropColor: String
    $outline: Boolean
    $backdropAvatar: Boolean
    $newsletter: Boolean
    $newsletterText: String
    $newsletterButton: String
    $newsletterDescription: String
    $headerTextColor: String
    $headerText: String
    $secondaryText: String
    $userId: Int
  ) {
    createLinkinbio(
      backgroundColor: $backgroundColor
      font: $font
      mediaColor: $mediaColor
      textColor: $textColor
      iconColor: $iconColor
      isBackground: $isBackground
      template: $template
      subdomain: $subdomain
      background: $background
      borderRadius: $borderRadius
      backdrop: $backdrop
      backdropColor: $backdropColor
      outline: $outline
      backdropAvatar: $backdropAvatar
      newsletter: $newsletter
      newsletterText: $newsletterText
      newsletterButton: $newsletterButton
      newsletterDescription: $newsletterDescription
      headerTextColor: $headerTextColor
      headerText: $headerText
      secondaryText: $secondaryText
      userId: $userId
    ) {
      id
      backgroundColor
      font
      textColor
      userId
    }
  }
`;

export const CREATE_STORE = gql`
  mutation CreateStorefront(
    $subdomain: String,
    $name: String,
    $backgroundColor: String,
    $storefrontIsPasscode: Boolean,
    $storefrontPass: String,
    $newsletterSection: Boolean,
    $newsletterImage: String,
    $headerText: String,
    $secondaryText: String,
    $componentColor: String,
    $storefront: Boolean!,
    $headingColor: String,
    $subTextColor: String,
    $embeddedLink: String,
    $featuredSection: Boolean,
    $socialsSection: Boolean,
    $actionButton: String,
    $actionButtonText: String,
    $linksSection: Boolean,
    $newsletterSubText: String,
    $newsletterHeading: String,
    $instagramShown: Boolean,
    $tiktokShown: Boolean,
    $facebookShown: Boolean,
    $twitterShown: Boolean,
    $instagram: String,
    $facebook: String,
    $tiktok: String,
    $font: String,
    $twitter: String,
    $subscribeText: String,
    $subscribeSubText: String,
    $headerImage: String,
    $secondaryImage: String,
    $subText: String,
    $description: String,
    $template: Int
  ) {
    createStorefront(
      subdomain: $subdomain,
      name: $name,
      backgroundColor: $backgroundColor,
      storefrontIsPasscode: $storefrontIsPasscode,
      storefrontPass: $storefrontPass,
      newsletterSection: $newsletterSection,
      newsletterImage: $newsletterImage,
      componentColor: $componentColor,
      headingColor: $headingColor,
      subTextColor: $subTextColor,
      storefront: $storefront,
      embeddedLink: $embeddedLink,
      featuredSection: $featuredSection,
      socialsSection: $socialsSection,
      actionButton: $actionButton,
      actionButtonText: $actionButtonText,
      linksSection: $linksSection,
      newsletterSubText: $newsletterSubText,
      newsletterHeading: $newsletterHeading,
      instagramShown: $instagramShown,
      tiktokShown: $tiktokShown,
      facebookShown: $facebookShown,
      twitterShown: $twitterShown,
      instagram: $instagram,
      facebook: $facebook,
      tiktok: $tiktok,
      headerText: $headerText,
      secondaryText: $secondaryText,
      font: $font,
      twitter: $twitter,
      subscribeText: $subscribeText,
      subscribeSubText: $subscribeSubText,
      headerImage: $headerImage,
      secondaryImage: $secondaryImage,
      subText: $subText,
      description: $description,
      template: $template
    ) {
      id
      name
      subdomain
    }
  }
`;
