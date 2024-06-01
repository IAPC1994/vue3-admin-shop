import { defineComponent, watchEffect, watch, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useFieldArray, useForm } from 'vee-validate';
import { useMutation, useQuery } from '@tanstack/vue-query';
import * as yup from 'yup';
import { createUpdateProductAction, getProductByIdAction } from '@/modules/products/actions';
import CustomInput from '@/modules/common/components/CustomInput.vue';
import CustomTextarea from '@/modules/common/components/CustomTextarea.vue';
import { useToast } from 'vue-toastification';

const validationSchema = yup.object({
  title: yup.string().required().min(3),
  slug: yup.string().required(),
  description: yup.string().required(),
  price: yup.number().required(),
  stock: yup.number().min(1).required(),
  gender: yup.string().required().oneOf(['men', 'women', 'kid']),
});

export default defineComponent({
  components: {
    CustomInput,
    CustomTextarea,
  },
  props: {
    productId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();
    const toast = useToast();
    const {
      data: product,
      isError,
      isLoading,
      refetch,
    } = useQuery({
      queryKey: ['product', props.productId],
      queryFn: () => getProductByIdAction(props.productId),
      retry: false,
    });

    const {
      mutate,
      isPending,
      isSuccess: isUpdateSuccess,
      data: updatedProduct,
    } = useMutation({
      mutationFn: createUpdateProductAction,
    });

    const { values, defineField, errors, handleSubmit, resetForm, meta } = useForm({
      validationSchema,
      // initialValues: product.value,
    });

    const [title, titleAttrs] = defineField('title');
    const [slug, slugAttrs] = defineField('slug');
    const [description, descriptionAttrs] = defineField('description');
    const [price, priceAttrs] = defineField('price');
    const [stock, stockAttrs] = defineField('stock');
    const [gender, genderAttrs] = defineField('gender');

    const { fields: sizes, remove: removeSize, push: pushSize } = useFieldArray<string>('sizes');
    const { fields: images } = useFieldArray<string>('images');

    const imageFiles = ref<File[]>([]);

    const onSubmit = handleSubmit(async (values) => {
      // const product = await createUpdateProductAction(value);
      // console.log(product);

      const formValues = {
        ...values,
        images: [...values.images, ...imageFiles.value],
      };

      mutate(formValues);
    });

    const toggleSize = (size: string) => {
      const currentSizes = sizes.value.map((s) => s.value);
      const hasSize = currentSizes.includes(size);

      if (hasSize) {
        removeSize(currentSizes.indexOf(size));
      } else {
        pushSize(size);
      }
    };

    const onFileChanged = (event: Event) => {
      const fileInput = event.target as HTMLInputElement;
      const fileList = fileInput.files;
      if (!fileList) return;
      if (fileList?.length === 0) return;

      for (const imageFile of fileList) {
        imageFiles.value.push(imageFile);
      }
    };

    watchEffect(() => {
      if (isError.value && !isLoading.value) {
        router.replace('/admin/products');
      }
    });

    watch(
      product,
      () => {
        if (!product) return;

        resetForm({
          values: product.value,
        });
      },
      {
        deep: true,
        immediate: true,
      },
    );

    watch(isUpdateSuccess, (value) => {
      // console.log({ isUpdateSuccess: isUpdateSuccess.value });
      if (!value) return;

      toast.success('Product updated correctly');
      router.replace(`/admin/products/${updatedProduct.value!.id}`);

      resetForm({
        values: updatedProduct.value,
      });

      imageFiles.value = [];
    });

    watch(
      () => props.productId,
      () => {
        console.log(props.productId);
        refetch();
      },
    );

    return {
      // Properties
      values,
      errors,
      meta,

      title,
      titleAttrs,
      slug,
      slugAttrs,
      description,
      descriptionAttrs,
      price,
      priceAttrs,
      stock,
      stockAttrs,
      gender,
      genderAttrs,
      imageFiles,
      onFileChanged,

      isPending,

      images,
      sizes,

      // Getters
      allSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],

      // Actions
      onSubmit,
      toggleSize,

      hasSize: (size: string) => {
        const currentSizes = sizes.value.map((s) => s.value);
        return currentSizes.includes(size);
      },
      temporalImageUrl: (imageFile: File) => {
        return URL.createObjectURL(imageFile);
      },
    };
  },
});
