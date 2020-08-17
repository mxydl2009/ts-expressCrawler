// 分析dell网页
interface Course {
  title: string;
  count: number;
}

interface CourseResult {
  time: number;
  data: Course[];
}

import fs from 'fs';
import path from 'path';
import cheerio from 'cheerio';
import { Analyzer } from './crawler';
// 定义json文件中的数据结构
interface Content {
  [propName: number]: Course[];
}
// DellAnalyzer写为单例模式
export default class DellAnalyzer implements Analyzer {
  private static instance: DellAnalyzer;
  static getInstance() {
    if (!DellAnalyzer.instance) {
      DellAnalyzer.instance = new DellAnalyzer();
    }
    return DellAnalyzer.instance;
  }
  private getCourseInfo(html: string) {
    const $ = cheerio.load(html); // 加载HTML文档（字符串）
    const courseItems = $('.course-item');
    const courseInfos: Course[] = [];
    courseItems.map((index, element) => {
      const descs = $(element).find('.course-desc');
      const title = descs.eq(0).text();
      const count = parseInt(
        descs
          .eq(1)
          .text()
          .split('：')[1],
        10
      );
      courseInfos.push({
        title,
        count
      });
    });
    return {
      time: new Date().getTime(), // 当前的时间戳
      data: courseInfos
    };
  }
  private generateJsonContent(courseResult: CourseResult, filePath: string) {
    let fileContent: Content = {};
    if (fs.existsSync(filePath)) {
      const contentExisted = fs.readFileSync(filePath, 'utf-8');
      // 防止文件是空文件或者全是空格的文件，导致JSON解析出错
      if (contentExisted !== '' && !contentExisted.match(/^\s+$/g)) {
        fileContent = JSON.parse(contentExisted);
      }
    }
    fileContent[courseResult.time] = courseResult.data;
    return fileContent;
  }
  public analyze(html: string, filePath: string) {
    const courseResult = this.getCourseInfo(html);
    const fileContent = this.generateJsonContent(courseResult, filePath);
    return JSON.stringify(fileContent);
  }
  private constructor() {}
}
