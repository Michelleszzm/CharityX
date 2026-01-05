package com.charity.x.common.utils;

import com.github.pagehelper.PageInfo;
import io.github.linpeilie.Converter;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;

/**
 * Mapstruct utility class
 * <p>Reference documentation: <a href="https://mapstruct.plus/introduction/quick-start.html">mapstruct-plus</a></p>
 *
 */
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class MapstructUtils {

    private static final Converter CONVERTER = SpringUtil.getBean(Converter.class);

    /**
     * Convert T type object to desc type object and return
     *
     * @param source Source entity
     * @param desc   Description object, converted object
     * @return desc
     */
    public static <T, V> V convert(T source, Class<V> desc) {
        if (ObjectUtils.isEmpty(source) || ObjectUtils.isEmpty(desc)) {
            return null;
        }
        return CONVERTER.convert(source, desc);
    }

    /**
     * Convert T type object, assign values to desc type object according to configured mapping field rules and return desc object
     *
     * @param source Source entity
     * @param desc   Converted object
     * @return desc
     */
    public static <T, V> V convert(T source, V desc) {
        if (ObjectUtils.isEmpty(source) || ObjectUtils.isEmpty(desc)) {
            return null;
        }
        return CONVERTER.convert(source, desc);
    }

    /**
     * Convert T type collection to desc type collection and return
     *
     * @param sourceList Source entity list
     * @param desc       Description object, converted object
     * @return desc
     */
    public static <T, V> List<V> convert(List<T> sourceList, Class<V> desc) {
        if (ObjectUtils.isEmpty(sourceList) || desc == null) {
            return Collections.emptyList();
        }
        return CONVERTER.convert(sourceList, desc);
    }

    /**
     * Convert Map to beanClass type collection and return
     *
     * @param map       Source data
     * @param beanClass Bean class
     * @return Bean object
     */
    public static <T> T convert(Map<String, Object> map, Class<T> beanClass) {
        if (ObjectUtils.isEmpty(map)) {
            return null;
        }
        if (beanClass == null) {
            return null;
        }
        return CONVERTER.convert(map, beanClass);
    }

    public static <S, T> PageInfo<T> convertPage(PageInfo<S> pageInfo, Class<T> clazz)  {
        if (ObjectUtils.isEmpty(pageInfo)) {
            return null;
        }
        if (clazz == null) {
            return null;
        }
        PageInfo<T> target = new PageInfo<>();
        BeanUtils.copyProperties(pageInfo, target);
        if (!CollectionUtils.isEmpty(pageInfo.getList())){
            target.setList(convert(pageInfo.getList(), clazz));
        }
        return target;
    }

}
