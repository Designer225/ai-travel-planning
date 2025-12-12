'use server'

import { prisma } from './prisma';
import { getCurrentUser, updateSessionUser } from './sessionControl';
import SiteUser from '@/types';

export async function updateUserProfile(
  updates: {
    firstName?: string;
    lastName?: string;
    bio?: string;
    location?: string;
  }
): Promise<{ success: boolean; user?: SiteUser; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const updateData: any = {};
    if (updates.firstName !== undefined) updateData.firstName = updates.firstName;
    if (updates.lastName !== undefined) updateData.lastName = updates.lastName;
    if (updates.bio !== undefined) updateData.bio = updates.bio;
    if (updates.location !== undefined) updateData.location = updates.location;

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    const siteUser: SiteUser = {
      id: updatedUser.id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      bio: updatedUser.bio,
      email: updatedUser.email,
      location: updatedUser.location,
      avatarUrl: updatedUser.avatarUrl,
    };

    // Update session with new user data
    await updateSessionUser(siteUser);

    return { success: true, user: siteUser };
  } catch (error) {
    console.error('Update user profile error:', error);
    return { success: false, error: "Failed to update profile" };
  }
}

export async function updateUserAvatar(
  avatarUrl: string
): Promise<{ success: boolean; user?: SiteUser; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    // Validate URL format (basic check)
    if (avatarUrl && !avatarUrl.match(/^(https?:\/\/|data:image)/)) {
      return { success: false, error: "Invalid avatar URL format" };
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { avatarUrl },
    });

    const siteUser: SiteUser = {
      id: updatedUser.id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      bio: updatedUser.bio,
      email: updatedUser.email,
      location: updatedUser.location,
      avatarUrl: updatedUser.avatarUrl,
    };

    // Update session with new user data
    await updateSessionUser(siteUser);

    return { success: true, user: siteUser };
  } catch (error) {
    console.error('Update user avatar error:', error);
    return { success: false, error: "Failed to update avatar" };
  }
}

export interface PaymentMethod {
  id: number;
  label: string;
  last4: string;
  cardNumber?: string;
  cardholderName?: string;
  expiry: string;
  cvv?: string;
  isDefault: boolean;
}

export async function getUserPaymentMethods(): Promise<{ success: boolean; paymentMethods?: PaymentMethod[]; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const paymentMethods = await prisma.paymentMethod.findMany({
      where: { userId: user.id },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    const formatted: PaymentMethod[] = paymentMethods.map((pm) => ({
      id: pm.id,
      label: pm.label,
      last4: pm.last4,
      expiry: pm.expiry,
      isDefault: pm.isDefault,
    }));

    return { success: true, paymentMethods: formatted };
  } catch (error) {
    console.error('Get user payment methods error:', error);
    return { success: false, error: "Failed to fetch payment methods" };
  }
}

export async function addPaymentMethod(
  label: string,
  last4: string,
  expiry: string,
  cardNumber?: string,
  cardholderName?: string,
  cvv?: string
): Promise<{ success: boolean; paymentMethod?: PaymentMethod; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    // Validate input
    if (!label || !last4 || !expiry) {
      return { success: false, error: "All required fields must be filled" };
    }

    if (last4.length !== 4 || !/^\d{4}$/.test(last4)) {
      return { success: false, error: "Last 4 digits must be 4 numbers" };
    }

    // Validate expiry format (MM/YY)
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      return { success: false, error: "Expiry must be in MM/YY format" };
    }

    // If this is the first payment method, set it as default
    const existingMethods = await prisma.paymentMethod.findMany({
      where: { userId: user.id },
    });

    const isDefault = existingMethods.length === 0;

    const paymentMethod = await prisma.paymentMethod.create({
      data: {
        userId: user.id,
        label,
        last4,
        cardNumber: cardNumber || "",
        cardholderName: cardholderName || "",
        expiry,
        cvv: cvv || "",
        isDefault,
      },
    });

    const formatted: PaymentMethod = {
      id: paymentMethod.id,
      label: paymentMethod.label,
      last4: paymentMethod.last4,
      cardNumber: paymentMethod.cardNumber,
      cardholderName: paymentMethod.cardholderName,
      expiry: paymentMethod.expiry,
      cvv: paymentMethod.cvv,
      isDefault: paymentMethod.isDefault,
    };

    return { success: true, paymentMethod: formatted };
  } catch (error) {
    console.error('Add payment method error:', error);
    return { success: false, error: "Failed to add payment method" };
  }
}

export async function deletePaymentMethod(
  paymentMethodId: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    // Verify payment method belongs to user
    const paymentMethod = await prisma.paymentMethod.findFirst({
      where: {
        id: paymentMethodId,
        userId: user.id,
      },
    });

    if (!paymentMethod) {
      return { success: false, error: "Payment method not found" };
    }

    const wasDefault = paymentMethod.isDefault;

    await prisma.paymentMethod.delete({
      where: { id: paymentMethodId },
    });

    // If we deleted the default, set the first remaining one as default
    if (wasDefault) {
      const remainingMethods = await prisma.paymentMethod.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'asc' },
        take: 1,
      });

      if (remainingMethods.length > 0) {
        await prisma.paymentMethod.update({
          where: { id: remainingMethods[0].id },
          data: { isDefault: true },
        });
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Delete payment method error:', error);
    return { success: false, error: "Failed to delete payment method" };
  }
}

export async function setDefaultPaymentMethod(
  paymentMethodId: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    // Verify payment method belongs to user
    const paymentMethod = await prisma.paymentMethod.findFirst({
      where: {
        id: paymentMethodId,
        userId: user.id,
      },
    });

    if (!paymentMethod) {
      return { success: false, error: "Payment method not found" };
    }

    // Unset all other defaults
    await prisma.paymentMethod.updateMany({
      where: {
        userId: user.id,
        isDefault: true,
      },
      data: {
        isDefault: false,
      },
    });

    // Set this one as default
    await prisma.paymentMethod.update({
      where: { id: paymentMethodId },
      data: { isDefault: true },
    });

    return { success: true };
  } catch (error) {
    console.error('Set default payment method error:', error);
    return { success: false, error: "Failed to set default payment method" };
  }
}

