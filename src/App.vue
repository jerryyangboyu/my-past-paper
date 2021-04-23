<template>
  <el-container class="container100">
    <el-main class="container100">
      <transition name="el-fade-in-linear">
        <el-empty
          class="container100"
          v-if="!showWidget"
          description="选择试卷以浏览Past-Paper"
        ></el-empty>
      </transition>

      <transition name="el-fade-in-linear">
        <div class="container100 paper-container" v-if="showWidget">
          <div class="paper-frame">
            <iframe
              class="frame left-frame"
              :src="paperURL"
              frameborder="0"
            ></iframe>
          </div>
          <transition name="el-fade-in-linear">
            <div class="paper-frame" v-if="showAnswer">
              <iframe
                class="frame right-frame"
                :src="markingURL"
                frameborder="0"
              ></iframe>
            </div>
          </transition>
        </div>
      </transition>
    </el-main>
    <el-footer>
      <el-form :inline="true">
        <el-form-item label="试卷编号">
          <el-cascader
            clearable
            v-model="value"
            :options="options"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>

        <el-form-item label="显示答案">
          <el-switch
            v-model="showAnswer"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </el-form-item>
      </el-form>
    </el-footer>
  </el-container>
</template>

<script>
export default {
  name: "App",

  data() {
    return {
      prefix: "https://papers.gceguide.com/A%20Levels/",
      showAnswer: true,
      value: [],
      showWidget: false,
      paperURL: "",
      markingURL: "",
      options: [],
      subjects: [
        {
          alias: "CS(9608)",
          name:
            "Computer%20Science%20(for%20final%20examination%20in%202021)%20(9608)/",
          paperNum: 4,
          yearFrom: 15,
          yearTo: 20,
        },
        {
          alias: "Physics(9702)",
          name: "Physics%20(9702)/",
          paperNum: 5,
          yearFrom: 15,
          yearTo: 20,
        },
        {
          alias: "Further Math(9231)",
          name: "Mathematics%20-%20Further%20(9231)/",
          paperNum: 4,
          yearFrom: 15,
          yearTo: 20,
        },
        {
          alias: "Math(9709)",
          name: "Mathematics%20(9709)/",
          paperNum: 5,
          yearFrom: 15,
          yearTo: 20,
        },
      ]
    };
  },

  methods: {
    handleChange(value) {
      if (value != null) {
        const subject = value[0];
        const subjectCode = subject.substr(-6, 4);
        const seasonChar = value[1];
        const year = value[2];
        const shortYear = year.substr(2, 2);
        const component = value[3];

        const fullPaperURL = `${this.prefix}${subject}${year}${subjectCode}_${seasonChar}${shortYear}_qp_${component}.pdf`;
        const fullMarkingURL = `${this.prefix}${subject}${year}${subjectCode}_${seasonChar}${shortYear}_ms_${component}.pdf`;

        console.log(value);
        console.log(fullPaperURL)

        this.paperURL = fullPaperURL;
        this.markingURL = fullMarkingURL;
        this.showWidget = true;
      } else {
        console.log("Has been cleared.");
        this.showWidget = false;
      }
    },

    generateOptionsArray() {
      let subjects = this.subjects;
      let subjectIndex = 0;
      let options = [];

      // subjectIndex,

      function pushSeason() {
        options[subjectIndex].children.push({
          value: "s",
          label: "s",
          children: [],
        });
        options[subjectIndex].children.push({
          value: "w",
          label: "w",
          children: [],
        });
      }

      function pushYear(yearFrom = 1, yearTo = 20) {
        for (let year = 2000 + yearFrom; year <= 2000 + yearTo; year++) {
          options[subjectIndex].children[0].children.push({
            value: `${year}/`,
            label: `${year}`,
            children: [],
          });
          options[subjectIndex].children[1].children.push({
            value: `${year}/`,
            label: `${year}`,
            children: [],
          });
        }
      }

      function pushComponentCode(paperNum, yearFrom = 1, yearTo = 20) {
        for (let i = 0; i <= yearTo - yearFrom; i++) {
          for (let j = 1; j <= paperNum; j++) {
            for (let k = 1; k <= 3; k++) {
              options[subjectIndex].children[0].children[i].children.push({
                value: `${j}${k}`,
                label: `${j}${k}`,
              });
            }
          }
        }

        for (let i = 0; i <= yearTo - yearFrom; i++) {
          for (let j = 1; j <= paperNum; j++) {
            for (let k = 1; k <= 3; k++) {
              options[subjectIndex].children[1].children[i].children.push({
                value: `${j}${k}`,
                label: `${j}${k}`,
              });
            }
          }
        }
      }

      function pushSubject(label, url, paperNum, yearFrom, yearTo) {
        options.push({
          value: url,
          label: label,
          children: [],
        });

        pushSeason();
        pushYear(yearFrom, yearTo);
        pushComponentCode(paperNum, yearFrom, yearTo);
      }

      function pushAll() {
        for (let i = 0; i < subjects.length; i++) {
          const name = subjects[i].alias ? subjects[i].alias: subjects[i].name;
          pushSubject(name, subjects[i].name, subjects[i].paperNum, subjects[i].yearFrom, subjects[i].yearTo);
          subjectIndex++;
        }
      }

      pushAll()

      // console.log(options);

      this.options = options;
    },
  },

  created() {
    this.generateOptionsArray();
  },
};
</script>

<style>
#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh;
  overflow-y: hidden;
}

body {
  margin: 0;
  padding: 0;
}

.frame {
  height: 100%;
}

.left-frame {
  width: 100%;
}

.right-frame {
  width: 100%;
}

.container100 {
  height: 100%;
  padding: 0 !important;
}

.paper-container {
  display: flex;
}

.paper-frame {
  width: 100%;
}

.el-input {
  width: 15rem !important;
}

.el-form {
  padding: 0.5rem;
}
</style>